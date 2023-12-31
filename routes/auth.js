const {Router} = require("express");
const {check} = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const validateFields = require("../middlewares/validateFields");

const router = Router();

router.post('/login',[
    check("email", "The email is required").isEmail(),
    check("password", "The password is required").not().isEmpty(),
    validateFields
], login);

router.post('/google',[
    check("id_token", "El tokenId de google es necesario").not().isEmpty(),
    validateFields
], googleSignIn);

module.exports = router;
