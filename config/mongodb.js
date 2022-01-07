var mongoose = require('mongoose');

const uri = "mongodb+srv://SuperPunch:rams1998727@cluster0-tkxxn.mongodb.net/personal";
module.exports = () => {
  mongoose.set('useUnifiedTopology', true);
  return mongoose.connect(uri,{useNewUrlParser: true})
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
};