const { request, response } = require("express");
const { uploadFileHelper } = require("../helpers/uploadFile");
const { User, Product } = require("../models");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2
cloudinary.config(process.env.CLOUDINARY_URL)


const unableExtension = ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'jpeg', 'gif', 'txt']

const uploadFile = async(req = request, res = response) => {
    try {
        const nameFile = await uploadFileHelper(req.files, unableExtension )
        res.json({ nameFile })
    } catch (msg) {
        res.status(400).json({msg})
    }
};

const updateImage = async (req = request, res = response) => {
    const { collection, id } = req.params;
    let model;

    try {
        switch (collection) {
            case "users":
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({ msg: "Usuario no existe en la base de datos" });
                }
                break;
            case "products":
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({ msg: "Producto no existe en la base de datos" });
                }
                break;
            default:
                return res.status(500).json({ msg: "Error inesperado" });
        };

        //limpiar la imagen y si existe reemplazarla
        if (model.image) {
            const nameArr = model.image.split("/");
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split(".")
            cloudinary.uploader.destroy(public_id)
        }

        const  tempPathFile  = req.files.file.tempFilePath;
        const cloudImage = await cloudinary.uploader.upload(tempPathFile);
        model.image = cloudImage.secure_url;
        await model.save();

        res.json({
            model
        });
    } catch (error) {
        console.error("Error en la función updateImage:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const getImages = async (req = request, res = response) => {
    const { collection, id } = req.params;

    let model;

    try {
        switch (collection) {
            case "users":
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({ msg: "Usuario no existe en la base de datos" });
                }
                break;
            case "products":
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({ msg: "Producto no existe en la base de datos" });
                }
                break;
            default:
                return res.status(500).json({ msg: "Error inesperado" });
        }

        if (model.image) {
            return res.json({ imageUrl: model.image });
        } else {
            return res.json({ msg: "Imagen no encontrada" });
        }
    } catch (error) {
        console.error("Error en la función getImages:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


module.exports = {
    uploadFile,
    updateImage,
    getImages
};





// const updateImageServer = async(req = request, res = response) => {
//     const {collection, id} = req.params;
//     let model;

//     switch(collection){
//         case "users":
//             model = await User.findById(id);
//             if(!model){
//                 res.status(400).json({msg: "usuario no existe en base de datos"})
//             }

//         break;
//         case "products":
//             model = await Product.findById(id);
//             if(!model){
//                 res.status(400).json({msg: "producto no existe en base de datos"})
//             }
//         break;
//         default:
//             return res.status(500).json({msg: "Error inesperado"})
//     };

//     if(model.image){
//         const pathImage = path.join(__dirname, "../uploads/", collection, model.image);
//         if(pathImage && fs.existsSync(pathImage)){
//             fs.unlinkSync(pathImage);
//         }
//     }

//     const nameFile = await uploadFileHelper(req.files, unableExtension, collection )
//     model.image = nameFile

//     await model.save();

//     res.json({
//        model
//     })
// }




