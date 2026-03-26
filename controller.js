const db = require('./db/queries');
const bcrypt = require("bcryptjs");
const { validationResult, matchedData } = require('express-validator');

function getHome(req, res) {
    res.render('home');
}

function getSignUp(req, res) {
    res.render('sign-up');
}

async function postSignUp(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('sign-up', {errors: errors.array()});
    }
    const { firstName, lastName, email, password } = matchedData(req);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.addUser(firstName, lastName, email, hashedPassword);
        res.redirect("/");
    } catch(err) {
        return next(err);
    }
}

function getLogOut(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

module.exports = {
    getHome,
    getSignUp,
    postSignUp,
    getLogOut
};