const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "f3494ac18011bd40601c4974c8868c140a888af1f67889953fb157a04a5a84163a0207f01ab558fc2efdc94a2cde1c27e148b94d392707082feafb2751f7ed1a");
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error: error | "Utilisateur non autorisé !" });
    }
};