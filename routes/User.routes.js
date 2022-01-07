var user = require("../controllers/User.controller");

module.exports = (app) => {
    app.post("/auth/registerUser", user.register);
    app.post("/user/allUsers", user.allUsers);
    app.post("/user/addUser", user.addUser);
    app.post("/user/updateUser", user.updateUser);
    app.post("/user/updateRealUser", user.updateRealUser);
    app.post("/user/updateUserOneItem", user.updateUserOneItem);
    app.delete("/user/deleteUser/:id", user.deleteUser);
};
