const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const validateJWT = async(req = request, res = response, next) => {
    
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "Token de autenticación invalido"
        });
    };

    try {
        const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(payload.uid);
        if(!user || !user.status ){
            return res.status(401).json({
                msg: "Usuario invalido"
            })
        }
        req.user = user;
        next();

    } catch (err) {
        console.log("JWT ERROR",err);
        res.status(401).json({
            msg:"Token invalido"
        })
    }
};

module.exports = validateJWT