const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

//Connecting to database
mongoose.connect("mongodb+srv://new-user:passwordplaceholder@piquantes.rvjyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée..."));

//Setting request headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

//Parsing json
app.use(express.json());

//Routes
app.use("/api/auth", userRoutes);

module.exports = app;