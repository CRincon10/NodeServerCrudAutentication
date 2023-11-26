const {Router} = require("express");
const {check} = require("express-validator");
const validateJWT = require("../middlewares/validateJWT");
const validateFields = require("../middlewares/validateFields");
const { createCategory, getCategoryById, getCategories, updateCategory, deleteCategory } = require("../controllers/categories");
const { validateCategoryById } = require("../helpers/db-validators");
const { isAdminUser } = require("../middlewares/validateRoles");

const router = Router();


router.get('/', getCategories);

router.get('/:id',[
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(validateCategoryById),
    validateFields
], getCategoryById);

router.post('/',[
    validateJWT,
    check("name", "El nombre de la categoría es obligatorio").not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
    validateJWT,
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(validateCategoryById),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJWT,
    isAdminUser,
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(validateCategoryById),
    validateFields
], deleteCategory);



module.exports = router