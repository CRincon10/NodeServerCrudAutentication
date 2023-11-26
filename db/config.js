const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("MongoDB connection successful");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = {
    dbConnection
};

