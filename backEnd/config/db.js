//database configaration and connection
const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected!")   
    } catch (error) {
        console.log("MongoDB connection error: ", error)
        process.exit(1);
    }
}


module.exports = connectDB;