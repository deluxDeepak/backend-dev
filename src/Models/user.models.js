import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,  //Caludinary URl
    },

    // Connection with video 
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'

        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })


// Direct encryption nahi kar sakte hai to mongoose ke hooks use karke kar sake hai 
// Mongoose middleware use kar sakte hai
// ->Arrow function nahi use karenge 
// ->Password save karne se pehle ye kar do aur next function ko call kar do 
// this.isModified("password") ye check karega ki koi field modified to nahi hai 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password, 10);
    next();
})



// Schema levle validation bol sakte hai isko 
// Custome method to check password 
// ->return karega true and false 
// ->Schema me jayda se jayda method lagao use karo 
userSchema.method.isPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}




// Token yehi genrate kar lenge 
userSchema.method.genrateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
userSchema.method.genrateRefreshToken = function () {
    jwt.sign(
        {
            // Isme only id rakhnege 
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema);