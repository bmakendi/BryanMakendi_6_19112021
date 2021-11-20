const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

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

//User routes
app.use("/api/auth", userRoutes);

//Images routes
app.use("/images", express.static(path.join(__dirname, "images")));

//Sauce routes
app.use("/api/sauces", sauceRoutes);

module.exports = app;