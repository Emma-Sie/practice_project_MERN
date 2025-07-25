let JwtStrategy = require('passport-jwt').Strategy
let ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models").user

module.exports = (passport)=>{
    let opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.PASSPORT_SECRET;

    passport.use(
        new JwtStrategy(opts, async function(jwt_payload, done) {
            console.log("jwt_payload",jwt_payload);
            try{
                let foundUser = await User.findOne({_id: jwt_payload.id})
                if(foundUser){
                    return done(null, foundUser); // req.user <= foundUser
                }else{
                    return done(null, false);
                }
            }catch (e) {
                return done(e, false);
            }
        }
    ));
}