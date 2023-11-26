const {Router} = require("express");
const {check} = require("express-validator");
const validateFields = require("../middlewares/validateFields");
const { getProductById, createProduct, updateProduct, deleteProduct, getProducts } = require("../controllers/products");
const validateJWT = require("../middlewares/validateJWT");
const { isAdminUser } = require("../middlewares/validateRoles");
const { ValidateProductById } = require("../helpers/db-validators");

const router = Router();

router.get('/', getProducts);

router.get('/:id',[
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(ValidateProductById),
    validateFields
], getProductById);

router.post('/',[
    validateJWT,
    check("name", "El nombre del producto es obligatorio").not().isEmpty(),
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(ValidateProductById),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminUser,
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(ValidateProductById),
    validateFields
], deleteProduct);

module.exports = router;