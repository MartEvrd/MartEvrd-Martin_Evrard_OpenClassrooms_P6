const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hashPass => {
            bcrypt.hash(req.body.email, 10)
            .then(hashMail => {
                const user = new User({
                    email: hashMail,
                    password: hashPass
                });
                user.save()
                    .then(() => res.status(201).json({message: "Utilisateur créé !"}))
                    .catch(() => res.status(400).json({error: "Utilisateur existant"}));
            })
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {


    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Paire email/mdp invalide' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire email/mdp invalide' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRETKEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };