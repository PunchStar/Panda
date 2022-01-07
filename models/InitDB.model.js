var Admin = require("./Admin.model");
var ShortCut = require("./ShortCut.model");
var PageLink = require("./PageLink.model");
var User = require("./User.model");

let adminObj = {
    email: "admin@gmail.com",
    password: "0f39191f7a30452feff4bd7d6ad35d8cg33b8c5b6e865c94c58c1651484a3c692",
};

let shortcutList = [
    {key: "Link1", value: "https://www.google.com/"},
    {key: "Link2", value: "https://www.google.com/"},
    {key: "Link3", value: "https://www.google.com/"},
    {key: "Link4", value: "https://www.google.com/"},
    {key: "Link5", value: "https://www.google.com/"},
    {key: "Link6", value: "https://www.google.com/"},
    {key: "Link7", value: "https://www.google.com/"},
    {key: "Link8", value: "https://www.google.com/"},
    {key: "Link9", value: "https://www.google.com/"},
]

let userList = [
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
    {fullName: "John", address: "AAA, BBB, CCC", phoneNumber: "123-444-5555", email: "john@gmail.com", password: "92586b3d9f1b77416dfb174c1e317d74g56db790f3d03dd4babc37e9f1549a5f3"},
]

let pagelinkObj = {
    banner: {image: "", url: ""},
    terms: "",
    privacy: "",
    contact: "",
}

async function initializeDB() {

    await Admin.findOne({ email: adminObj.email }).then(user => {
        if(!user) {
            Admin.insertMany(adminObj)
        }
    });

    await PageLink.findOne({}).then(pagelink => {
        if(!pagelink) {
            PageLink.insertMany(pagelinkObj)
        }
    });

    await User.findOne({}).then(user => {
        if(!user) {
            User.insertMany(userList)
        }
    });

    await ShortCut.findOne({}).then(shortcut => {
        if(!shortcut) {
            ShortCut.insertMany(shortcutList)
        }
    });

}

initializeDB();