import mongoose from "mongoose";


// Create schema
const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true,
        lowercase: true
    },
    hashedPassword: {
        required: function () {
            return this.provider === 'local'
        },
        type: String,
    },
    googleRefreshToken: {
        required: function () {
            return this.provider === 'google'
        },
        type: String
    },
    provider: {
        enum: ["local" , "google"],
        required: true,
        type: String,
        default: 'local'
    }
}, {timestamps: true})

// Model
const User = mongoose.model('User', userSchema)

// Export
export default User