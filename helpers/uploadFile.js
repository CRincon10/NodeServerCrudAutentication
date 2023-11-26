const path = require("path");
const { v4: uuid } = require("uuid")


const uploadFileHelper = (files, unableExtension, folder = "") => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const shortName = file.name.split(".");
        const fileExtension = shortName[shortName.length - 1];
        
        if(!unableExtension.includes(fileExtension)){
            return reject("Extension de archivo no permitida")
        }

        const temporalFileName = uuid() + "." + fileExtension;
        const uploadPath = path.join( __dirname, "../uploads/", folder, temporalFileName);
        

        file.mv(uploadPath, function (err) {
            if (err) {
                return reject( err );
            };

            resolve(temporalFileName)
        });
    });
};

module.exports = {
    uploadFileHelper
}

