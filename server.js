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
        return res.json({success: true, data: data});
	} else  {
		data = data.toString("utf8");
		return res.json({success: true, data: data });
	} 
	
});
const port = process.env.PORT || 5005;  //process.env.port is Heroku's port if you choose to deplay the app there
app.listen(port, () => console.log("Server up and running on port " + port));