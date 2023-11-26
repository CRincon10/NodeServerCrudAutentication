const {response, request} = require("express");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");


const getUsers = async(req = request, res = response) => {
    const {limit = 15, startTo = 0} = req.query;
    
    const resp = await Promise.all([
        User.find({status:true})
        .skip(Number(startTo))
        .limit(Number(limit)),
        User.countDocuments({status: true})
    ])

    res.send({
        resp
    });
}
const putUsers = async(req, res = response) => {
    const id = req.params.id;
    const {_id, password, google, ...rest } = req.body;

    if( password ){
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.send({
        user
    });
}
const postUsers = async(req, res = response) => {

    const body = req.body;
    const {name, email, password, role} = body
    const user = new User({name, email, password, role});
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    user.status = true;

    await user.save();

    res.send({
        user
    });
}

const deleteUsers = async(req, res = response) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {status: false});

    res.send({
        user,
    });
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
}