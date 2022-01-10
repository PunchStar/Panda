var fileUpload = require("../controllers/FileUpload.controller");

module.exports = (app) => {
    app.post("/upload/fileUpload", fileUpload.fileUpload);
};
