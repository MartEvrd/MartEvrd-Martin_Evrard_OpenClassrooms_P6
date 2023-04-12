const Sauce = require ("../models/sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

exports.newSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: req.auth.userId
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Nouvelle sauce enregistrée !"}))
        .catch(error => res.status(401).json({ error }));
}

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message: "Non autorisé"});
            } else if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: "Sauce mise à jour"}))
                    .catch(error => res.status(401).json({ error }));
                })
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: "Sauce mise à jour"}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message: "Non autorisé"});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id})
                        .then(() => res.status(200).json({ message: "Sauce supprimée"}))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.opinionSauce = (req, res, next) => {
    const sauceObject = { ...req.body };
    delete sauceObject.userId;
    
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const usersLiked = sauce.usersLiked;
            const usersDisliked = sauce.usersDisliked;

            switch (req.body.like) {
                case 1:
                    usersLiked.push(req.auth.userId);
                    sauceObject.usersLiked = usersLiked;
                    sauceObject.likes = sauce.likes + 1;
                    break;
                case -1:
                    usersDisliked.push(req.auth.userId);
                    sauceObject.usersDisliked = usersDisliked;
                    sauceObject.dislikes = sauce.dislikes + 1;
                    break;
                case 0:
                    if (usersLiked.includes(req.auth.userId)) {
                        sauceObject.usersLiked = sauce.usersLiked.filter(userId => userId != req.auth.userId);
                        sauceObject.likes = sauce.likes - 1;
    
                    } else if (usersDisliked.includes(req.auth.userId)) {
                        sauceObject.usersDisliked = sauce.usersDisliked.filter(userId => userId != req.auth.userId);
                        sauceObject.dislikes = sauce.dislikes - 1;
                    }
                    break;
                default:
                    res.status(400).json({ error: "Bad request on opinion"})
            }
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: "Avis modifié"}))
                .catch(error => res.status(401).json({error}));
        })
        .catch(error => res.status(400).json({ error }));
};