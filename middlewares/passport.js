const { Strategy, ExtractJwt } = require('passport-jwt');

const { SECRET } = require('../config');
const Employees = require('../model/employee');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//this is a startgy because in jwt token we have add Bearer at begning and extracting bearer token from header.
    secretOrKey: SECRET
};

//passport is middleware to protect route.
module.exports = (passport) => {
    passport.use(new Strategy(options, async (payload, done) => {
        try {
            //payload is what we have used while generating jwt token
            //means if that person is loged in then only ->user object is appended in req object.
            let user = await Employees.findById(payload.id);
            if (user) {
                return done(null, user);//user object will be appended to req obj and we can get that in controller using req.user
            }
            else {
                return done(null, false);
            }
        } catch (err) {
            return done(null, false);
        }
    }));
};