const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

const registerUser = async(req, res) => {
    const { name, email, password } = req.body;

    try{
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({msg : 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // creating the user

        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        if(user){
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
            })
        }

    }catch(error){
        res.status(500).json({ msg: "Server error during user Resgistration "});
    }
}

const loginUser = async(req, res) => {
    const {email, password } = req.body;

    try{

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), 
            });
        } 
        else 
        {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error during login' });
    }

}

const getMe = async (req, res) => {
    // req.user is already available thanks to our protect middleware!
    res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe }