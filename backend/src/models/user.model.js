import mongoose from "mongoose"
import bcrypt from  'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    about: {
        type: String
    },
    avatar: {
        type: String
    },
    savedLists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lists"
        }
    ],
    reposts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "stories"
        }
    ]
}, {timestamps: true})

//pass save krne se pehle use hash kr lo
userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

//password dcrypt krke check kro ki sahi h ya nhi
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//access or refrsh banane k lie:
userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}    
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}    
    )
}

export const User = mongoose.model("User", userSchema)