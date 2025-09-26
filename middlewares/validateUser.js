const { isAlpha, isAlphanumeric, isEmail } = require('validator');
const { errorMessages } = require('../utils/errorMessages');

const validateUser = (req, res, next) => {

    const { firstName, lastName, userName, email } = req.body

    const errorMsgObj ={};

    if (!isAlpha(firstName)) {
        errorMsgObj.firstName = errorMessages.firstName;

    }
    if (!isAlpha(lastName)) {
        errorMsgObj.lastName = errorMessages.lastName;

    }
    if (!isAlphanumeric(userName)) {
       errorMsgObj.userName = errorMessages.userName;

    }
    if (!isEmail(email)) {
        errorMsgObj.email = errorMessages.email;

    }
    if (Object.keys(errorMsgObj).length > 0) {
       return res.status(400).json({ message: 'validation unsuccessful', error: errorMsgObj })
    }

    next();

}

module.exports = validateUser;