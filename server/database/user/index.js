import mongoose from "mongoose";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String },
        address: [{ detail: { type: String }, for: { type: String } }],
        phoneNumber: [{ type: Number }],
    },
    {
        timestamps: true,
    }
);

// Attachments
UserSchema.methods.generateJwtToken = function () { 
    return jwt.sign({ user: this._id.toString() }, "zomatoApp");
};

// Helper Functions
UserSchema.statics.findByEmailAndPhone = async (email, phoneNumber) => { 
    const checkuserByEmail = await UserModel.findOne({ email });
    const checkuserByPhone = await UserModel.findOne({ phoneNumber });
    
    if (checkuserByEmail || checkuserByPhone) {
        throw new Error("User Already Exists !!!");
    }
    return false;
};
UserSchema.statics.findByEmailAndPassword = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User does not exist !!!");

    // Compare Password :-
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) throw new Error("Invalid Credentials !!!");
    
    // If the email & password matches :-
    return user;
};
 
UserSchema.pre("save", function (next) {
    const user = this;

    // Password is been modified or not ?
    if (!user.isModified('password')) return next();

    // Generate bcrypt and salt :-
    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        // Hash the password 8 times :-
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);

            // Will be assigning hashed password back :-
            user.password = hash;
            return next();
        })
    })
})

export const UserModel = mongoose.model("users", UserSchema);