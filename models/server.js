require('dotenv').config();
const cors = require("cors")
const express = require('express');

const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            user: "/api/users",
            auth: "/api/auth",
            categories: "/api/categories",
            products: "/api/products",
            search: "/api/search",
            uploads: "/api/uploads"
        }
        this.dataBaseConnection();

        this.middlewares();
        this.routes();
    }

    async dataBaseConnection() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors())

        //parseo y lectura del body
        this.app.use(express.json())

        //directorio publico
        this.app.use(express.static("public") )

        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        //middleware para llamar las rutas 
        this.app.use(this.paths.auth, require("../routes/auth"));
        this.app.use(this.paths.user, require("../routes/users"));
        this.app.use(this.paths.categories, require("../routes/categories"));
        this.app.use(this.paths.products, require("../routes/products"));
        this.app.use(this.paths.search, require("../routes/search"));
        this.app.use(this.paths.uploads, require("../routes/upload"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`)
        });
    }

}

module.exports = Server