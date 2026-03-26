const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db/queries');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" },
            async (email, password, done) => {
                try {
                    const user = await db.findUser(email);
                    if (!user) {
                       return done(null, false, { message: "Incorrect email" })
                    };
                        
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                       return done(null, false, { message: "Incorrect password" })
                    };
    
                    return done(null, user);
                } catch(err) {
                    return done(err);
                }
            }
        )
    )

    passport.serializeUser((user, done) => done(null, user.id));
        
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.matchUser(id);
            done(null, user);
        } catch(err) {
            done(err);
        }
    });
}