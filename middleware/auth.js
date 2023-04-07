const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'HOT_TAKES--TOKEN_IDENTIFICATION');
        const userId = decodedToken.userId;
        req.auth = {
            userId : userId
        };
    next();
    }
    catch(error) {
        res.status(401).json({error});
    }
}