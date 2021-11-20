const fs = require("fs");
const Sauce = require("../models/Sauce");


//Creates the sauce thanks to the Sauce model, then saves it into the database
exports.postSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "La sauce a été enregistrée !" }))
        .catch(error => res.status(400).json({ error }));
}

//Determines wether user liked or disliked the sauce
//If the user did either of them, adds it to the corresponding array
//Deletes it and his likes/dislikes if it unliked/undisliked
//Updates the sauce with a save() 
exports.definesLikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case -1:
                    if (!(req.body.userId === sauce.usersDisliked.find( userId => userId === req.body.userId))) {
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(req.body.userId);
                        sauce.save()
                            .then(() => res.status(200).json({ message: "Vous avez dislike la sauce !" }))
                            .catch(error => res.status(400).json({ error }));
                    } else res.status(403).json({ error: "Déjà dislike !"});
                    break;
                case 0:
                    if ((req.body.userId === sauce.usersDisliked.find( userId => userId === req.body.userId))) {
                        sauce.dislikes -= 1;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
                        sauce.save()
                            .then(() => res.status(200).json({ message: "Vous avez retiré votre dislike !" }))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        sauce.likes -= 1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
                        sauce.save()
                            .then(() => res.status(200).json({ message: "Vous avez retiré votre like !" }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case 1:
                    if (!(req.body.userId === sauce.usersLiked.find( userId => userId === req.body.userId))) {
                        sauce.likes += 1;
                        sauce.usersLiked.push(req.body.userId);
                        sauce.save()
                            .then(() => res.status(200).json({ message: "Vous avez like la sauce !" }))
                            .catch(error => res.status(400).json({ error }));
                    } else res.status(403).json({ error: "Déjà like !"});
                    break;
                default:
                    break;
            }
        })
        .catch(error => res.status(404).json({ error }));
}

//If there's a file, we update it, else we update everything else that was modified with the request's body.
//Deletes the old image first.
exports.updateSauce = (req, res, next) => {
    if (req.file){
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink("images/" + filename, (err) => {
                    if (err) throw err;
                })
            })
            .catch(error => res.status(500).json({ error }));
    }
    const sauceObject = req.file ? 
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce bien modifiée !" }))
        .catch(error => res.status(400).json({ error }));
};

//Deletes the sauce's image in images directory then deletes the sauce in the database 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink("images/" + filename, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce bien supprimée." }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}