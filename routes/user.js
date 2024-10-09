const express = require('express');
const { signup, login, saveLinks, getLinks, getCurrentUser, checkLinkAvailability } = require('../controllers/userController'); // Ensure you import checkLinkAvailability
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/save-links', authMiddleware, saveLinks);
router.get('/get-links', authMiddleware, getLinks);
router.get('/current-user', authMiddleware, getCurrentUser); // Route for getting current user
router.post('/check-link', checkLinkAvailability); // New route for checking link availability

module.exports = router;
