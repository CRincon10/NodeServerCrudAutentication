const { Category, Product } = require("../models");
const Role = require("../models/roleModel");
const User = require("../models/userModel");


const roleIsValid = async(role = "") => {
    const existRol = await Role.findOne({role})
    if(!existRol){
        throw new Error(`Role not found`)
    }
}

const emailIsAlready = async(email, res) => {
    const existEmail = await User.findOne({ email})
    if(existEmail){
        throw new Error("Email already exist")
    }
}

const validateUserById = async(id =" ") => {
    const existUserId = await User.findById(id)
    if(!existUserId){
        throw new Error("User Id not found")
    }
};

const validateCategoryById = async(id="") => {
    const existCategory = await Category.findById(id)
    if(!existCategory){
        throw new Error("Category not found")
    }
}

const ValidateProductById = async(id="") => {
    const existProduct = await Product.findById(id)
    if(!existProduct){
        throw new Error("Product not found")
    }
}

const validateAllowCollection = (collection, allowCollection = []) => {
    const isIncluded = allowCollection.includes(collection);
    if(!isIncluded){
        throw new Error("Colección no permitida para actualizar")
    } else return true;
}

module.exports = {
    roleIsValid,
    emailIsAlready,
    validateUserById,
    validateCategoryById,
    ValidateProductById,
    validateAllowCollection
}