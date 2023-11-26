const {Router} = require("express");
const {check} = require("express-validator");
const validateFields = require("../middlewares/validateFields");
const { uploadFile, updateImage, getImages } = require("../controllers/uploads");
const { validateAllowCollection } = require("../helpers/db-validators");
const { validateFile } = require("../middlewares/validateFile");

const router = Router();

router.post('/',[
    validateFile,
    validateFields
], uploadFile);

router.put('/:collection/:id',[
    validateFile,
    check("id", "Id mongo invalido").isMongoId(),
    check("collection").custom(x => validateAllowCollection(x, ["users", "products"])),
    validateFields
], updateImage)

router.get('/:collection/:id', [
    check("id", "Id mongo invalido").isMongoId(),
    check("collection").custom(x => validateAllowCollection(x, ["users", "products"])),
    validateFields
], getImages)




module.exports = router;