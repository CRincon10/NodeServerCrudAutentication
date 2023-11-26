const {response, request} = require("express"); 
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { ObjectId } = require("mongoose").Types

const allowCollections = ["users", "category", "products", "roles"]

const searchUsers = async(term, res = response) => {
    const validateMongoId = ObjectId.isValid(term);
    if( validateMongoId ){
        const userDb = await User.findById(term);
        return res.json({
            results: (userDb) ? [ userDb ] : []
        })
    };

    const regexSearch = new RegExp(term, 'i')  //insensible a mayusculas para la busqueda en db

    const user = await User.find({ 
        $or: [{name: regexSearch}, {email: regexSearch}],
        $and: [{status:true}]
    })

    res.json({
        results: user ?? []
    })
};

const searchCategories = async(term, res = response) => {
    const validateMongoId = ObjectId.isValid(term);
    if( validateMongoId ){
        const categoryDb = await Category.findById(term);
        return res.json({
            results: (categoryDb) ? [ categoryDb ] : []
        })
    };

    const regexSearch = new RegExp(term, 'i')  //insensible a mayusculas para la busqueda en db
    const category = await Category.find({name: regexSearch, status:true})

    res.json({
        results: category ?? []
    })
};

const searchProducts = async(term, res = response) => {
    const validateMongoId = ObjectId.isValid(term);
    if( validateMongoId ){
        const productDb = await Product.findById(term).populate("category", "name").populate('user', 'name');
        return res.json({
            results: (productDb) ? [ productDb ] : []
        })
    };

    const regexSearch = new RegExp(term, 'i')  //insensible a mayusculas para la busqueda en db

    const product = await Product.find({ 
        $or: [{name: regexSearch}],
        $and: [{status:true}, {available: true}]
    }).populate('category', 'name').populate('user', 'name')

    res.json({
        results: product ?? []
    })
};
    


const search = (req = request, res = response) => {
    
    const { collection, term } = req.params;

    if(!allowCollections.includes(collection)){
        return res.status(400).json({
            msg: `las colecciones permitidas son: ${ allowCollections }`
        })
    }

    switch (collection) {
        case "users":
            searchUsers(term, res)
        break;
        case "category":
            searchCategories(term, res)
        break;
        case "products":
            searchProducts(term, res)
        break;
        default:
            req.status(500).json({
                msg: "Esta búsqueda no esta agregada en las colecciones permitidas"
            })
    }

};

module.exports = {
    search
}