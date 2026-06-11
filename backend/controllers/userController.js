// ✅ FIX: use node: prefix to explicitly import Node's built-in crypto
// This avoids conflict with the Web Crypto API in Node 18+
const crypto = require('node:crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        let newRole = "User";
        if (req.user && req.user.role === "Admin" && role === "Admin") {
            newRole = "Admin";
        }

        const user = await User.create({ name, email, password, role: newRole });

        if (user) {
            res.status(201).json({
                token: generateToken(user._id),
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || "User"
                },
            });
        }
    } catch (error) {
        console.log("REGISTER ERROR:", error);
        res.status(500).json({ msg: "Server error during user Registration" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                token: generateToken(user._id),
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ msg: "If this email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // ✅ Use env variable instead of hardcoded localhost
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset Request - Nexus",
            text: `You requested a password reset.\n\nClick the link below:\n\n${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, ignore this email.`
        });

        res.status(200).json({ msg: "Reset link sent to your email." });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error.message);
        res.status(500).json({ msg: "Failed to send reset email. Please try again." });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired reset link. Please request a new one." });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ msg: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error.message);
        res.status(500).json({ msg: "Server error during reset password." });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword };