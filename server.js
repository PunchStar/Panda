const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
const config_question =  require('./config/config_question');

dotenv.config();
const partners = {};
config_question.partner.forEach((elem) => {
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
app.use(bodyParser.json());
app.use(fileUpload());
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
require('./routes/FileUpload.routes')(app);
require('./routes/User.routes')(app);


const port = process.env.PORT || 5005;  //process.env.port is Heroku's port if you choose to deplay the app there
app.listen(port, () => console.log("Server up and running on port " + port));