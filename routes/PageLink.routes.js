var pageLink = require("../controllers/PageLink.controller");

module.exports = (app) => {
    app.post("/pageLink/allPageLinks", pageLink.allPageLinks);
    app.post("/pageLink/updatePageLink", pageLink.updatePageLink);
};
