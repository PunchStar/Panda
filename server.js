import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from 'dotenv';
import cors from 'cors';
import { createSignedUrl, listBucket, getObject }  from './lib/awssigned.js';
import confg_question from './config/config_question.js';
const app = express();
// const fileUpload = require('express-fileupload');

dotenv.config();
const env = 'dev';
const partners = {};
console.log(partners);

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
        res.send(data);
        //   return res.json({success: true, data: data});
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
	for( let i = 0; i < 100; i++) {
		let elem = list[i];
		users_obj[elem.user] = users_obj[elem.user] || [];
		const [question_num, ts, file_type] = elem.filename.split(/\./);
		const d = new Date(parseInt(ts));
		const datetime = d.toLocaleString();
		const transcript_filename = file_type == 'ogg' ? `${env}/${req.params.partner}/${req.params.interview}/${elem.user}/${question_num}.${ts}.txt` : ``;

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
				url: `/admin/media-download/${req.params.partner}/${req.params.interview}/${elem.user}/${elem.filename}`,
				transcript_url: `/admin/media-download/${req.params.partner}/${req.params.interview}/${elem.user}/${question_num}.${ts}.txt`,
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
    console.log('users',users)
    return res.json({success: true, users: users});
	// res.render('admin/user-media', { layout: 'admin', title: 'Perceptive Panda Admin', partner: req.params.partner, interview: req.params.interview, users });
}
app.post('/admin/user-input/get-media', async function(req, res) {
    console.log("<< admin - user-media >>");
	const orig_list = await listBucket(`${env}/${req.body.partner}/${req.body.interview}`);
	await get_interviews_media(req, res, orig_list);
});
const port = process.env.PORT || 5005;  //process.env.port is Heroku's port if you choose to deplay the app there
app.listen(port, () => console.log("Server up and running on port " + port));