import mongoose, { Document, Model, Schema } from "mongoose";
import bycrypt from "bcryptjs";
import { timeStamp } from "console";
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;


};
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "please enter a valid email"
        },
        unique: true,

    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minlength: [6, "password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",

    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        }

    ],

}, { timestamps: true })//user can created at time and updated at.

//Hash Password before saving

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bycrypt.hash(this.password, 10);
    next();
});

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<Boolean> {
    return await bycrypt.compare(enteredPassword, this.password);
};
const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;