var activity = require("../controllers/Activity.controller");

module.exports = (app) => {
    app.post("/activity/allActivities", activity.allActivities);
};
