const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
    name: { type: String, required: true, unique: true },
    status:{ type: String, required: true, default: true},
    user: {type: Schema.Types.ObjectId, ref: "User", require: true},
    price: {type: Number, default: 0 },
    category: {type: Schema.Types.ObjectId, ref:"Category", require: true},
    description: {type: String },
    available: {type: Boolean, default: true },
    image: {type: String}
})

ProductSchema.methods.toJSON = function() {
    const {__v, status, ...product} = this.toObject();
    return product;
}

module.exports = model("Product", ProductSchema)