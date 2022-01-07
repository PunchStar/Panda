module.exports = {
    salt: "b05bd5a64e9a5b1f3046bef577b81bdf",
    secretKey: "secretKey",
    fileUploadedSubPath: process.env.NODE_ENV === 'production' 
        ? "build"
        : "public",
}