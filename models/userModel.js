const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    name:{
        type: String,
        required: [true, 'The name is required']
    },
    email:{
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'The password is required']
    },
    image:{
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
    
});

//MODIFICA como se ve el objeto que retorna de la base de datos debe ser una funcion normal no un callBack
UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id
    return user;
}

module.exports = model("User", UserSchema)