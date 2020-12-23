import mongoose from "mongoose";
// const mongoose = require('mongoose');
import crypto from 'crypto';
// const crypto = require('crypto');
import jwt from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');

/**
 * 
 */
export enum OTPResult {
    EXIRED,
    VALID,
    INVALID_OTP,
    OTP_NOT_MATCH
};


const User = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    session: { type: String, required: false, default: null },
    isAdmin: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    username: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    salt: { type: String, required: true },
    profile: { type: String, required: false },
    otp: { type: Number, default: null, required: false },
    otp_time: { type: Date, default: null, required: false },
    default_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false, default: null }
});

User.methods.validPassword = function (password: string) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

User.methods.setOTP = function () {
    const otp = +Math.floor(89998 * Math.random() + 10001);
    console.log('TODO: Send OTP', otp);
    this.otp = otp;
    this.otp_time = new Date();
    console.log(this.otp_time);
    // TODO: Send OTP
}

User.methods.verifyOTP = function (otp: string): OTPResult {
    const tmp = parseInt(otp);
    if (isNaN(tmp)) return OTPResult.INVALID_OTP; // Parsing Error

    if (tmp !== this.otp) return OTPResult.OTP_NOT_MATCH; // Invalid otp

    const start = new Date(this.otp_time);
    const end = new Date();
    const diff = end.getTime() - start.getTime();

    if (diff > 300000) return OTPResult.EXIRED;

    return OTPResult.VALID;
}


User.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    this.accountType = 'email';
};

User.methods.setToken = function () {
    // TODO: Fix expiry Date
    const expire = new Date();
    expire.setTime(expire.getTime() + 30 * 24 * 60 * 60 * 1000); // 30days

    const token = jwt.sign({
        id: this._id,
        exp: (expire.getTime() / 1000),
    }, process.env.SECRET || 'somesecretkey');

    this.session = token;
    return token;
}

export default mongoose.model('User', User);
// module.exports = mongoose.model('User', User);
