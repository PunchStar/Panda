var user = require("../controllers/User.controller");

module.exports = (app) => {
    app.post("/login", user.login);
};
