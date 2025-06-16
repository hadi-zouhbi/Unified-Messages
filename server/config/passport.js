import passport from 'passport'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import User from '../models/User'

// Config JWT Options
const options = {
jwtFromRequest: ExtractJwt.fromHeader('authorization'),
secretOrKey: process.env.JWT_SECRET,
}

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            
        } catch (error) {
            return done(error, false)
        }
    })
)