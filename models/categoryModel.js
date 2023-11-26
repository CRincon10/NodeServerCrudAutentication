const { Schema, model } = require('mongoose')

const CategorySchema = Schema({
    name: { type: String, required: true, unique: true },
    status:{ type: String, required: true, default: true},
    user: {type: Schema.Types.ObjectId, ref: "User", require: true}
})

CategorySchema.methods.toJSON = function() {
    const {__v, ...category} = this.toObject();
    return category;
}

module.exports = model("Category", CategorySchema)