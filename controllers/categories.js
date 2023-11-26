const { response, request } = require("express");
const { Category } = require("../models");


const createCategory = async(req = request, res = response) => {
    const categoryName = req.body.name.toUpperCase();
    const categoryDb =  await Category.findOne({name:categoryName})

    if(categoryDb){ res.status(400).json({ msg: "Ya existe una categoría con ese nombre" }) };

    const data = { name: categoryName, user: req.user._id };
    const newCategory = new Category(data);
    await newCategory.save();

    res.status(201).json({ newCategory });
};

const getCategoryById = async(req = request, res = response) => {
    const categoryById = await Category.findById(req.params.id).populate('user', 'name email');
    if(!categoryById){ res.status(400).json({ msg: "No existe una categoría con ese ID" }) }
    res.status(201).json({ categoryById })
}

const getCategories = async(req = request, res = response) => {
    const {limit = 15, startTo = 0} = req.query;
    const resp = await Promise.all([
        Category.find({status:true})
        .skip(Number(startTo))
        .limit(Number(limit))
        .populate('user', 'name email'),
        Category.countDocuments({status: true})

    ])

    res.send({
        resp
    });
}

const updateCategory = async(req = request, res = response) => {
    const id = req.params.id;
    const name = req.body.name;
    const status = req.body.status ?? true;
    const category = await Category.findByIdAndUpdate(id, { name: name.toUpperCase(), status })

    res.send({
        category
    });
}

const deleteCategory = async(req = request, res = response) => {
    const { id } = req.params;
    const user = await Category.findByIdAndUpdate(id, {status: false});

    res.send({
        user,
    });
}

module.exports = {
    createCategory,
    getCategoryById,
    getCategories,
    updateCategory,
    deleteCategory
}