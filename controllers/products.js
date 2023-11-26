const {response, request} = require("express");
const { Product, Category } = require("../models");

const createProduct = async(req = request, res = response) => {
    const productName = req.body.name.toUpperCase();
    const productDb =  await Product.findOne({ name:productName }).populate("category", "name")
    const categoryDb = await Category.findById(req.body.category)

    if(productDb){ res.status(400).json({ msg: "Ya existe un producto con el mismo nombre" }) };
    if(!categoryDb){ res.status(400).json({ msg: "La categoría seleccionada no existe" }) };

    const data = { 
        name: productName, 
        user: req.user._id, 
        category: categoryDb._id,
        price: req.body.price
    };
    const newProduct = new Product(data);
    await newProduct.save();

    res.status(201).json({ newProduct });
};

const getProductById = async(req = request, res = response) => {
    const productById = await Product.findById(req.params.id).populate("category", "name");
    if(!productById){ res.status(400).json({ msg: "No existe un producto con ese ID" }) }
    res.status(201).json({ productById })

}

const getProducts = async(req = request, res = response) => {
    const {limit = 15, startTo = 0} = req.query;
    const resp = await Promise.all([
        Product.find({status:true})
        .skip(Number(startTo))
        .limit(Number(limit))
        .populate('category', 'name'),
        Product.countDocuments({status: true})
    ])

    res.send({
        resp
    });
}

const updateProduct = async(req = request, res = response) => {
    const {id} = req.params;
    const {status, user, ...data} = req.body;

    if(data.name){
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;
    const product = await Product.findByIdAndUpdate(id, data, { new: true })
        .populate('user', 'name').populate("category", "name");

    res.send({
        product
    });
}

const deleteProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {status: false, available: false}, { new:true  });

    res.send({
        product,
    });
}

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct
}