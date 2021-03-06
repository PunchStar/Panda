import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from 'dotenv';
import cors from 'cors';
import { send_email } from './lib/awsses.js';
import { createSignedUrl, listBucket, getObject }  from './lib/awssigned.js';
import confg_question from './config/config_question.js';
import Mixpanel from 'mixpanel';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const app = express();
// const fileUpload = require('express-fileupload');

dotenv.config();
const env = process.env.NODE_ENV === "development" ? "dev" : (process.env.NODE_ENV === "production" ? "prod" : process.env.NODE_ENV);
const partners = {};
let partner_userID = "Not Applicable";
let integration_type = null;
let intergration_result = null;
let event_uuid = null;
let invitee_uuid = null;
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
// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static("client/build"));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
//     });
// }
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
function isPandaID(id) {
	id = id || "";
	const parts = id.split('-');
	if (parts.length == 5 && 
		parts[0].length == 8 && 
		parts[1].length == 4 && 
		parts[2].length == 4 && 
		parts[3].length == 4 && 
		parts[4].length == 12)
		return true;
	return false;
}
function validate_interview_and_user(req, u_can_be_null) {
	const partner = req.body.partner.toUpperCase();
	const interview = req.body.interview;
	let user = req.body.user;
	if (u_can_be_null || !user) {
		user = uuidv4();
	}

	if (!partner || !user || !interview || !partners[partner] || !partners[partner].interview_obj[interview]) {
		return {};
	}

	return { partner, user, interview };
}

app.post('/login', async function(req, res) {
    if(req.body.userName && req.body.password && req.body.userName.toLowerCase() == 'admin' && req.body.password.toLowerCase() == '99ppPass'.toLowerCase()) {
        res.json({success:true, token:'1'})
    } else if (req.body.userName && req.body.password && req.body.partnerId && partners[req.body.partnerId.toUpperCase()] && req.body.userName.toLowerCase() == partners[req.body.partnerId.toUpperCase()].partner.toLowerCase() && req.body.password.toLowerCase() == partners[req.body.partnerId.toUpperCase()].password.toLowerCase()) {
        res.json({success:true, token:'2'})
	}
    else
        return res.json({success:false})
});
app.post('/input-selector/answer-audio', async function(req, res) {
	// const questions = partners[req.body.partner].interview_obj[req.body.interview].questions;
	const { partner, user, interview } = validate_interview_and_user(req, false);
	const ts = +new Date();
	const filename = `${env}/${partner}/${interview}/${user}/${req.body.question_number}.${ts}.ogg`;
	// partner_userID = req.body.user || "Not Applicable";

	let url = '';
    url = await createSignedUrl(filename, 'audio/ogg; codecs=opus');
    return res.json({success: true, url: url});
	
});

app.post('/input-selector/answer-text', async function(req, res) {
	const { partner, user, interview } = validate_interview_and_user(req, false);
	// const questions = partners[req.body.partner].interview_obj[req.body.interview].questions;
	const ts = +new Date();
	const filename = `${env}/${partner}/${interview}/${user}/${req.body.question_number}.${ts}.txt`;
	// partner_userID = user || "Not Applicable";

	let url = '';
	if (env !== 'local') {
		url = await createSignedUrl(filename, 'text/plain');
	}

    return res.json({success: true, url: url});
	
});

app.post('/input-selector/getobject', async function(req, res) {
	// const questions = partners[req.body.partner].interview_obj[req.body.interview].questions;
	let data = null;
	try {
		data = await getObject(req.body.filename);
	} catch(e) {
		return res.sendStatus(404);
	}
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
	if (orig_list == null)
		return res.json({success: true, users: []});
	const list = orig_list.map((elem) => {
		const cleaned = elem.replace(`${env}/${req.body.partner}/${req.body.interview}/`, '');
		if (cleaned === elem) {
			return null;
		}
		const [user, filename] = cleaned.split(/\//);
		return { user, filename };
	});
	const users_obj = {};
	// let coun_i =  list.length > 40 ? 40: list.length;

	for( let i = 0; i < list.length; i++) {
		let elem = list[i];
		users_obj[elem.user] = users_obj[elem.user] || [];
		const [question_num, ts, file_type] = elem.filename.split(/\./);
		const d = new Date(parseInt(ts));
		// const datetime = d.toLocaleString();
		const transcript_filename = file_type == 'ogg' ? `${env}/${req.body.partner}/${req.body.interview}/${elem.user}/${question_num}.${ts}.txt` : ``;

		let data = null;
		let transcript_exist = 0;
		let transcript_file_dest = ``;
		let dataText = '';
		if(file_type === 'txt'){
			try {
				dataText = await getObject(`${env}/${req.body.partner}/${req.body.interview}/${elem.user}/${elem.filename}`);
			} catch(e) {
			}
		}
		
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
		var datetime = new Date(parseInt(ts)).toLocaleString("en-US", {timeZone: "PST8PDT"});
		const questionsArr = partners[req.body.partner].interview_obj[req.body.interview].questions;
		if (!users_obj[elem.user].length || users_obj[elem.user][0].type === 'Text' || (users_obj[elem.user][0].type === 'Audio' && file_type === 'ogg')) {
			users_obj[elem.user].push({
				question: parseInt(question_num),
				questionContent:questionsArr[parseInt(question_num - 1)]?.text ?questionsArr[parseInt(question_num - 1)].text :'',
				questionContentRe:questionsArr[parseInt(question_num - 1)]?.text ?'' :'Removed',
				ts,
				datetime,
				type: file_type === 'ogg' ? 'Audio' : 'Text',
				is_audio: file_type === 'ogg' ? 1 : 0,
				transcript_exist,
				textResult: dataText.toString("utf8"),
				url: `/admin/media-download/${req.body.partner}/${req.body.interview}/${elem.user}/${elem.filename}`,
				transcript_url: `/admin/media-download/${req.body.partner}/${req.body.interview}/${elem.user}/${question_num}.${ts}.txt`,
				transcript_file_dest
			});
		}
	}
	const users = [];
	Object.keys(users_obj).forEach((elem) => {
		users_obj[elem] = users_obj[elem].sort((a, b) => parseInt(a.ts) - parseInt(b.ts));
		users.push({
			user: elem,
			files: users_obj[elem]
		});
	});
	users.sort((a, b) => parseInt(b.files[0].ts) - parseInt(a.files[0].ts));
    return res.json({success: true, users: users});
	// res.render('admin/user-media', { layout: 'admin', title: 'Perceptive Panda Admin', partner: req.params.partner, interview: req.params.interview, users });
}
// const admin_logged_in_middleware = function (req, res, next) {
// 	let user = auth(req);
// 	if (user && user.name && user.pass) {
// 		// Admin always works.
// 		if (user.name.toLowerCase() === 'admin' && user.pass.toLowerCase() === '99ppPass'.toLowerCase()) {
// 			return next();
// 		}
// 		// If the user is a partner, and the requested part of the admin is for that partner.
// 		if (user && user.name && user.pass && partners[user.name.toUpperCase()] && partners[user.name.toUpperCase()].password.toLowerCase() === user.pass.toLowerCase() && req.params.partner.toLowerCase() === user.name.toLowerCase()) {
// 			return next();
// 		}
// 	}

// 	res.set({
// 		'WWW-Authenticate': 'Basic realm="Perceptive Panda Admin"'
// 	}).sendStatus(401);
// };
// app.get('/admin_logo', admin_logged_in_middleware, function(req, res) {
// 	res.render('admin/index', { layout: 'admin', title: 'Perceptive Panda Admin' });
// });

app.post('/admin/user-input/get-media', async function(req, res) {
	const orig_list = await listBucket(`${env}/${req.body.partner}/${req.body.interview}/${req.body.user}`);
	await get_interviews_media(req, res, orig_list);
});

app.get('/admin/media-download/:partner/:interview/:user/:filename', async function(req, res) {
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
		res.send('<div style="white-space: pre-line;">' + data + '</div>');
	} 
});

app.post('/send-audio-generated-email', async function(req, res) {
	const email_to = partners[req.body.partner].email || [];

	let site_url = `http://localhost:3000`;
	if (env === 'dev') {
		site_url = `https://reactdev.perceptivepanda.com`;
	} else if (env === 'prod') {
		site_url = `https://www.perceptivepanda.com`;
	}

	const email_send = partners[req.body.partner].email_send == undefined ? true : partners[req.body.partner].email_send;
	const link = `${site_url}/admin/user-media/${req.body.partner}/${partners[req.body.partner].interview_obj[req.body.interview].name}/${req.body.user}/`;
	intergration_result = intergration_result || "";
	event_uuid = event_uuid || "";
	invitee_uuid = invitee_uuid || "";
	if (partners[req.body.partner].integration) {
		if (env !== 'local') {
			if (integration_type == "calendly") {
				const paired_event_endpoint = (env !== "prod") ? "https://hooks.zapier.com/hooks/catch/11643492/b8krv0b/silent/" : "https://hooks.zapier.com/hooks/catch/11643492/bsmjzr1/silent/";
				axios.get(paired_event_endpoint, {
					params: {
						e_uri: event_uuid,
						i_uri: invitee_uuid,
						mid: link,
						pid: 'PARTNER_FIELD_FROM_CONFIG_QUESTIONSJS_GOES_HERE'
					}
				})
				.then(async function(response) {
					if (email_send) {
						await send_email(
							'support@perceptivepanda.com', 
							email_to, 
							'Newly scheduled demo with interview', 
							`<p>You have a newly scheduled interview.</p><p>See calendar event here: ${intergration_result}</p><p>See interview here: ${link}</p>`, 
							`You have a newly scheduled interview.\n\nSee calendar event here: ${intergration_result}\n\nSee interview here: ${link}`);
						res.json({success:true, data:'done'});
					}
				})
				.catch(function (error) {
					if (env === 'dev') console.log(error);
				});
			} else if (integration_type == null) {
				if (email_send) {
					await send_email(
						'support@perceptivepanda.com', 
						email_to, 
						'New interview!', 
						`<p>A new user interview session was just generated through PerceptivePanda.</p><p>Click here for all the session data: ${link}</p>`, 
						`A new user interview session was just generated through PerceptivePanda.\n\nClick here for all the session data: ${link}`);
					res.json({success:true, data:'done'});
				}
			}
		}
	}
	else {
		if (env !== 'local') {
			if (email_send) {
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
		}
	}
	// res.json({success:true, data:'done'});
});

app.post('/integration/get', function(req, res) {
	const { partner, user, interview } = validate_interview_and_user(req, !isPandaID(req.body.user));

	if (!partner) {
		return res.sendStatus(404);
	}
	
	// partner_userID = req.body.user || "Not Applicable";
	integration_type = req.body.integration_type;

	res.json(
		{
			partner,
			user: user,
			interview,
			integration: partners[partner].integration || false,
			integration_link: (env !== "prod") ? "https://panda-demo-f236d.web.app/" : partners[partner].integration_app_link,
			x_button: partners[partner].x_button || 0,
			datasaur_data: { name: req.query.name, 
				firstname: req.query.firstname, 
				lastname: req.query.lastname, 
				email: req.query.email
			},
			calendlyAuth: partners[partner].calendlyAuth || false,
			calendlyHostLink: (env !== "prod") ? "https://calendly.com/perceptivepanda-demo/15min" : partners[partner].calendlyHostLink,
			additionalCalendlyParams: partners[partner].additionalCalendlyParams || false,
		});
});

app.post('/input-selector/event', function(req, res) {
	const { partner, user, interview } = validate_interview_and_user(req, !isPandaID(req.body.user));

	if (!req.body.partner) {
		return res.sendStatus(404);
	}

	// partner_userID = req.body.user || "Not Applicable";
	intergration_result = Buffer.from(req.body.event_link || "", 'base64').toString("utf-8");
	event_uuid = Buffer.from(req.body.event_uuid || "", 'base64').toString("utf-8");
	invitee_uuid = Buffer.from(req.body.invitee_uuid || "", 'base64').toString("utf-8");

	if (intergration_result != undefined || event_uuid != undefined || invitee_uuid != undefined)
		integration_type = "calendly";

	res.json(
		{
			partner:req.body.partner,
			user:user,
			interview:req.body.interview,
			answer_text_url: `/answer-text/${req.body.partner}/${req.body.interview}/${user}/1`, 
			answer_audio_url: `/answer-audio/${req.body.partner}/${req.body.interview}/${user}/1`,
			partner_name: partners[req.body.partner].partner_name,
			input_selector_type: partners[req.body.partner].input_selector_type === 'b' ? true : false,
			x_button: partners[req.body.partner].x_button || 0
		});
});

// MixPanel
app.post('/event', async function(req, res) {
	const { e, p, u, i, q, c, pu } = req.body;
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
		partner_userID = pu;
	// console.log(req.body, partner_userID);return;

	mixpanel.track(e, {
		distinct_id: `${p}????${u}????${i}`,
		$os: os,
		partner: p,
		partner_user: `${p}????${partner_userID}`,
		partner_interview: `${p}????${i}`,
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
