import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from 'dotenv';
import cors from 'cors';
import { send_email } from './lib/awsses.js';
import { createSignedUrl, listBucket, getObject }  from './lib/awssigned.js';
import confg_question from './config/config_question.js';
const app = express();
// const fileUpload = require('express-fileupload');

dotenv.config();
const env = 'dev';
const partners = {};
let partner_userID = null;
let mixpanel = null;
switch(env) {
	case 'prod': mixpanel = Mixpanel.init('1f47670881f7c33899deeaaf7cc94524'); break;
	case 'dev': mixpanel = Mixpanel.init('820fb47d4ab8cd1e52bf879add08313c'); break;
	default:
	case 'local': mixpanel = Mixpanel.init('c9fad51e49059dcb80d838121b7f4d72'); break;
}

confg_question.forEach((elem) => {
	partners[elem.partner] = elem;
	elem.interview_obj = {};
	elem.interviews.forEach((i_elem)=> {
		elem.interview_obj[i_elem.name] = i_elem;
	});
});
//Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use( bodyParser.json());
// app.use(fileUpload());
if(process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//Routes
// require('./routes/FileUpload.routes')(app);
// require('./routes/User.routes')(app);
app.post('/input-selector/answer-audio', async function(req, res) {
	console.log('- answer-audio -');
	// const questions = partners[req.body.partner].interview_obj[req.body.interview].questions;
	const ts = +new Date();
	const filename = `${env}/${req.body.partner}/${req.body.interview}/${req.body.user}/${req.body.question_number}.${ts}.ogg`;
	partner_userID = req.body.user || "Not Applicable";

	let url = '';
    url = await createSignedUrl(filename, 'audio/ogg; codecs=opus');
	console.log('-----------')
    return res.json({success: true, url: url});
	
});
app.post('/input-selector/answer-text', async function(req, res) {
	console.log('- answer-text -');
	// const questions = partners[req.body.partner].interview_obj[req.body.interview].questions;
	const ts = +new Date();
	const filename = `${env}/${req.body.partner}/${req.body.interview}/${req.body.user}/${req.body.question_number}.${ts}.txt`;
	partner_userID = req.body.user || "Not Applicable";

	let url = '';
	if (env !== 'local') {
		url = await createSignedUrl(filename, 'text/plain');
	}
    console.log('-----------')

    return res.json({success: true, url: url});
	
});
app.post('/input-selector/getobject', async function(req, res) {
	console.log('- /input-selector/get-object -');
	// const questions = partners[req.body.partner].interview_obj[req.body.interview].questions;
	let data = null;
	try {
		data = await getObject(req.body.filename);
	} catch(e) {
		return res.sendStatus(404);
	}
    console.log('finelne',req.body.filename)
    console.log(data)
    if (!req.body.text) {
		res.setHeader('content-type', 'audio/ogg; codecs=opus');
        // res.send(data);
        return res.json({success: true, data: data});
	} else  {
		data = data.toString("utf8");
		return res.json({success: true, data: data });
	} 
	
});
const get_interviews_media = async(req, res, orig_list) => {
	console.log('- get interview media -');

    console.log("--1---")
	const list = orig_list.map((elem) => {
		const cleaned = elem.replace(`${env}/${req.body.partner}/${req.body.interview}/`, '');
		if (cleaned === elem) {
			return null;
		}
		const [user, filename] = cleaned.split(/\//);
		return { user, filename };
	});
    console.log("--2---",list.length)
    // console.log('list',list)
	const users_obj = {};
    let coun_i = list.length > 100 ? 100: list.length;
	for( let i = 0; i < coun_i; i++) {
		let elem = list[i];
		users_obj[elem.user] = users_obj[elem.user] || [];
		const [question_num, ts, file_type] = elem.filename.split(/\./);
		const d = new Date(parseInt(ts));
		const datetime = d.toLocaleString();
		const transcript_filename = file_type == 'ogg' ? `${env}/${req.body.partner}/${req.body.interview}/${elem.user}/${question_num}.${ts}.txt` : ``;

		let data = null;
		let transcript_exist = 0;
		let transcript_file_dest = ``;
		if (transcript_filename != ``) {
			try {
				data = await getObject(transcript_filename);
			} catch(e) {
			}

			transcript_file_dest = await createSignedUrl(transcript_filename, 'text/plain');
			if (data != null) {
				transcript_exist = 1;
			}
		}

		if (!users_obj[elem.user].length || users_obj[elem.user][0].type === 'Text' || (users_obj[elem.user][0].type === 'Audio' && file_type === 'ogg')) {
			users_obj[elem.user].push({
				question: parseInt(question_num),
				ts,
				datetime,
				type: file_type === 'ogg' ? 'Audio' : 'Text',
				is_audio: file_type === 'ogg' ? 1 : 0,
				transcript_exist,
				url: `/admin/media-download/${req.body.partner}/${req.body.interview}/${elem.user}/${elem.filename}`,
				transcript_url: `/admin/media-download/${req.body.partner}/${req.body.interview}/${elem.user}/${question_num}.${ts}.txt`,
				transcript_file_dest
			});
		}
	}
	const users = [];
    console.log("--3---")
	Object.keys(users_obj).forEach((elem) => {
		users_obj[elem] = users_obj[elem].sort((a, b) => parseInt(a.ts) - parseInt(b.ts));
		users.push({
			user: elem,
			files: users_obj[elem]
		});
	});
    console.log("--4---")

	users.sort((a, b) => parseInt(b.files[0].ts) - parseInt(a.files[0].ts));
    return res.json({success: true, users: users});
	// res.render('admin/user-media', { layout: 'admin', title: 'Perceptive Panda Admin', partner: req.params.partner, interview: req.params.interview, users });
}
app.post('/admin/user-input/get-media', async function(req, res) {
    console.log("<< admin - user-media >>");
	const orig_list = await listBucket(`${env}/${req.body.partner}/${req.body.interview}`);
	await get_interviews_media(req, res, orig_list);
});
app.get('/admin/media-download/:partner/:interview/:user/:filename', async function(req, res) {
	console.log("<< admin - media-download >>");
	const [question_num, ts, file_type] = req.params.filename.split(/\./);

	if (file_type !== 'ogg' && file_type !== 'txt') {
		return res.sendStatus(404);
	}
	const filename = `${env}/${req.params.partner}/${req.params.interview}/${req.params.user}/${req.params.filename}`;

	let data = null;
	try {
		data = await getObject(filename);
	} catch(e) {
		return res.sendStatus(404);
	}

	if (!data) {
		return res.sendStatus(404);
	}

	if (file_type === 'ogg') {
		res.setHeader('content-type', 'audio/ogg; codecs=opus');
		res.send(data);
	} else if (file_type === 'txt') {
		data = data.toString("utf8");
		res.send(data);
	} 
});
app.post('/send-audio-generated-email', async function(req, res) {
	console.log("---- send email -----");
	const email_to = partners[req.body.partner].email || [];
	email_to.push('andre@perceptivepanda.com');
	// email_to.push('superpunch727@gmail.com');
	let site_url = `http://localhost:3000`;
	if (env === 'dev') {
		site_url = `https://dev.perceptivepanda.com`;
	} else if (env === 'prod') {
		site_url = `https://www.perceptivepanda.com`;
	}
	const link = `${site_url}/admin/user-media/${req.body.partner}/${partners[req.body.partner].interview_obj[req.body.interview].name}/${req.body.user}/`;

	if (env !== 'local') {
		// if (req.body.customer_support == 0) {
			await send_email(
				'support@perceptivepanda.com', 
				email_to, 
				'New interview!', 
				`<p>A new user interview session was just generated through PerceptivePanda.</p><p>Click here for all the session data: ${link}</p>`, 
				`A new user interview session was just generated through PerceptivePanda.\n\nClick here for all the session data: ${link}`);
		// }
		//  else {
		// 	await send_email(
		// 		'support@perceptivepanda.com', 
		// 		email_to, 
		// 		'Request for customer support', 
		// 		`<p>A new user interview session was just generated through PerceptivePanda. The user requested help from customer support.</p><p>PerceptivePanda Generated SessionID: ${req.body.user}</p><p>Partner Generated UserID: ${partner_userID}</p>`, 
		// 		`A new user interview session was just generated through PerceptivePanda. The user requested help from customer support.\n\PerceptivePanda Generated SessionID: ${req.body.user}\n\nPartner Generated UserID: ${partner_userID}`);
		// }
		res.json({success:true, data:'done'});
	}
});
// MixPanel
app.post('/event', async function(req, res) {
	console.log('- event -');
	const { e, p, u, i, q, c } = req.body;

	if (!e || !p || !u || !i || !partners[p] || !partners[p].interview_obj || !partners[p].interview_obj[i]) {
		return res.sendStatus(404);
	}

	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const ua = req.get('User-Agent');
	const url = (e == 'popup-generated') ? req.headers.referer : '';
	const question = q;
	const code = c;
	let os = '';

	if (ua.includes("Win") || ua.includes("Mac"))
		os = "Desktop";
	else {
		if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod"))
			os = "iOS";
		else
			os = "Android";
	}
	if (partner_userID === "Not Applicable")
		partner_userID = u;
	console.log(req.body);return;

	mixpanel.track(e, {
		distinct_id: `${p}🐼${u}🐼${i}`,
		$os: os,
		partner: p,
		partner_user: `${p}🐼${partner_userID}`,
		partner_interview: `${p}🐼${i}`,
		user: partner_userID,
		interview: i,
		ip_address: ip,
		ua,
		url,
		question,
		code
	});

	if (partners[p].event_url) {
		axios.post(partners[p].event_url, {
			event: e,
			os: os,
			partner: p,
			user: u,
			interview: i,
			ip,
			ua,
			url,
			question,
			code
		});
		// Ignore the return. Don't await it. Since it's fire and forget.
	}

	res.sendStatus(204);
});
const port = process.env.PORT || 5005;  //process.env.port is Heroku's port if you choose to deplay the app there
app.listen(port, () => console.log("Server up and running on port " + port));