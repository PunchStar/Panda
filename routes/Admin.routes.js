var admin = require("../controllers/Admin.controller");

module.exports = (app) => {
    app.post("/auth/registerAdmin", admin.register);
    app.post("/auth/updateAdmin", admin.updateAdmin);
    app.post("/auth/login", admin.login);
};
