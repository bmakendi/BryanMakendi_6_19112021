const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Inscription réussie, utilisateur créé et enregistré !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user)
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid)
                        return res.status(401).json({ error: "Mauvais mot de passe !" });
                    res.status(200).json({
                        userId: user._id, 
                        token: jwt.sign(
                            { userId: user._id },
                            "f3494ac18011bd40601c4974c8868c140a888af1f67889953fb157a04a5a84163a0207f01ab558fc2efdc94a2cde1c27e148b94d392707082feafb2751f7ed1a",
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: "pitié" }));
        })
        .catch(error => res.status(500).json({ error }));
};