const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.checkLinkAvailability = async (req, res) => {
    const { link } = req.body;

    try {
        
        const existingLink = await User.findOne({ link });
        if (existingLink) {
            return res.status(200).json({ available: false }); 
        }
        return res.status(200).json({ available: true }); 
    } catch (error) {
        console.error('Link availability check error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.signup = async (req, res) => {
    const { name, email, password, link } = req.body;

    try {
     
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const linkExists = await User.findOne({ link });
        if (linkExists) {
            return res.status(400).json({ message: 'Link already taken' });
        }


        const user = new User({
            name,
            email,
            password, 
            link, 
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password); 

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, link: user.link });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.saveLinks = async (req, res) => {
    const { links } = req.body;
    const userId = req.userId; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.socialLinks = links; 
        await user.save();

        res.status(200).json({ message: 'Links saved successfully' });
    } catch (error) {
        console.error('Error saving links:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getLinks = async (req, res) => {
    const userId = req.userId; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ links: user.socialLinks });
    } catch (error) {
        console.error('Error retrieving links:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCurrentUser = async (req, res) => {
    const userId = req.userId; // Get user ID from the request object set by the auth middleware

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            id: user._id,
            name: user.name,
            email: user.email,
            link: user.link,
            socialLinks: user.socialLinks 
        });
    } catch (error) {
        console.error('Error retrieving current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
