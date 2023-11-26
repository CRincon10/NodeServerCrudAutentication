const {response, request} = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");
const { getJWT } = require("../helpers/get-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req = request, res = response) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                msg: "Credenciales invalidas - usuario no encontrado"
            })
        }

        if(!user.status){
            return res.status(400).json({
                msg: "Usuario inhabilitado - status false"
            })
        }

        const validatePassword = bcryptjs.compareSync(password, user.password)
        if(!validatePassword){
            return res.status(400).json({
                msg: "Credenciales invalidas - contrasena invalida"
            })
        }

        //JWT
        const token = await getJWT( user.id )

        res.json({
            user,
            token
        })

    } catch(err) {
        console.log("ERROR",err);
        return res.status(500).json({
            msg: "Algo salio mal"
        })
    }
};

const googleSignIn = async(req = request, res = response) => {
    const token = req.body;
    try {
        const {name, picture, email } = await googleVerify(token.id_token);

        let user = await User.findOne({email});

        if(!user){
            const data = {
                name,
                email,
                password: ":P",
                image: picture,
                google: true,
                role: "user",
            };
            
            user = new User(data);
            await user.save();
        }

        if(!user.status){
            return res.status(401).json({
                msg:"Comunícate con el administrador",
                user
            })    
        }

        const jwtToken = await getJWT( user.id )


        res.json({
            msg:"Authenticated",
            user,
            jwtToken
        })

    } catch(err) {
        res.status(400).json({
            msg:"Unauthenticated",
            token
        })

    }
    
}

module.exports = {
    login,
    googleSignIn
}