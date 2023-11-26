const jwt = require("jsonwebtoken");

const getJWT = (uid = "") => {
    
    return new Promise((resolve, reject) => {

        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err){
                console.log("No se pudo generar JWT");
                reject("Token invalid");
            }else{
                resolve( token );
            }
        })
    })
}

module.exports = {
    getJWT
}