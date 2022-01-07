var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
    type: {type: Number, default: 0 },
    key: {type: String, default: "" },
    content: {type: String, default: "" },
    time: {type: Date, default: Date.now },
});

ActivitySchema.methods.generateNewActivity = function() {
    switch(this.type) {
        case 0:
            this.content = this.key + " was created successfully."; break;
        case 1:
            this.content = this.key + " has been updated."; break;
        case 2:
            this.content = this.key + " was removed."; break;
        case 3:
            this.content = this.key + " updated your profile info."; break;
        default:
            this.content = this.key + " was created successfully."; break;
    }
}

var Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
