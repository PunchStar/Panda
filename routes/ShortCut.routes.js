var shortcut = require("../controllers/ShortCut.controller");

module.exports = (app) => {
    app.post("/shortcut/allShortCuts", shortcut.allShortCuts);
    app.post("/shortcut/addShortCut", shortcut.addShortCut);
    app.post("/shortcut/updateShortCut", shortcut.updateShortCut);
    app.delete("/shortcut/deleteShortCut/:id", shortcut.deleteShortCut);
};
