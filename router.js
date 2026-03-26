const controller = require('./controller');
const db = require('./db/queries');
const passport = require("passport");
const { body } = require('express-validator');
const { Router } = require('express');
const router = Router();

const validator = [
    body('firstName').trim()
        .isAlpha().withMessage('First name must only contain letters')
        .isLength({min: 1, max: 15}).withMessage('First name must be between 1 and 15 characters'),
    body('lastName').trim()
        .isAlpha().withMessage('Last name must only contain letters')
        .isLength({min: 1, max: 15}).withMessage('Last name must be between 1 and 15 characters'),
    body('email').trim()
        .isEmail().withMessage('Incorrect email')
        .normalizeEmail()
        .custom(async (email) => {
            const user = await db.findUser(email);
            if (user) throw new Error('Email already registered')
        }),
    body('password').trim()
        .isLength({min: 6}).withMessage('Password must be at least 6 characters'),
    body('confirmation').custom((value, {req}) => {
        if (value !== req.body.password) throw new Error('Password does not match')
            return true; //<----Why here needed unlike previous field !!!!!!!!!
    })

];

router.get('/', controller.getHome);
router.get("/sign-up", controller.getSignUp);
router.post("/sign-up", validator, controller.postSignUp);

router.post("/log-in", passport.authenticate("local", {
                            successRedirect: "/",
                            failureRedirect: "/",
                            failureMessage: true
                        }));
router.get("/log-out", controller.getLogOut);

module.exports = router;