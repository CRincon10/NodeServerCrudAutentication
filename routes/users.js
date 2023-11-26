const {Router} = require("express");
const {check} = require("express-validator");
const { emailIsAlready, validateUserById} = require("../helpers/db-validators");
const {getUsers, putUsers, postUsers, deleteUsers} = require("../controllers/users");
const validateFields = require("../middlewares/validateFields");
const { roleIsValid } = require("../helpers/db-validators");
const validateJWT = require("../middlewares/validateJWT");
const { isAdminUser, validateRoles } = require("../middlewares/validateRoles");

const router = Router();

router.get('/', getUsers);

router.put('/:id',[
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(validateUserById),
    check("role").custom(roleIsValid),
    validateFields
], putUsers);

router.post('/',[
    check("name", "The field is required").not().isEmpty(),
    check("password", "The password length must be at lest 6 letters").isLength({min:6}),
    check("email", "The email is not valid").isEmail(),
    check("email").custom(emailIsAlready),
    check("role").custom(roleIsValid),
    validateFields
], postUsers);

router.delete('/:id',[
    validateJWT,
    //isAdminUser,  ==>  Middleware para validar solo si el usuario es admin
    validateRoles("admin", "user"),
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(validateUserById),
    validateFields
], deleteUsers);

module.exports = router