const { request, response } = require("express");


const isAdminUser = (req = request, res = response, next) => {
    
    if(!req.user){
        res.status(500).json({
            msg:"Se requiere token para validar rol de usuario"
        });
    } else {
        if(req.user.role !== "admin"){
            res.status(401).json({
                msg: "Usuario no tiene permisos para ejecutar esta acción"
            });
        }
        next();
    }
};

const validateRoles = ( ...roles ) => {

    return (req = request, res = response, next) => {
        if(!roles.includes(req.user.role)){
            res.status(401).json({
                msg: `solo los usuarios ${roles} pueden realizar esta acción`
            });
        }
        next();
    };
};


module.exports = {
    isAdminUser,
    validateRoles
}