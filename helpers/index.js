const dbValidators = require("./db-validators");
const getJWT = require("./get-jwt");
const googleVerify = require("./google-verify");
const uploadFile = require("./uploadFile");

module.exports = {
    ...dbValidators,
    ...getJWT,
    ...googleVerify,
    ...uploadFile,
}