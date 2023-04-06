const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// ! Le package mongoose-unique-validator n'est utilisable qu'avec une version mongoose ANTERIEURE à 7.0.0

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema)