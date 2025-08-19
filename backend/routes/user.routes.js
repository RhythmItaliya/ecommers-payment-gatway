const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser, testUser, testUserProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verify');

const router = express.Router();

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/profile', verifyToken, getUserProfile)
router.put('/profile', verifyToken, updateUserProfile)
router.post('/logout', logoutUser)
router.post('/test', testUser)
router.get('/test-profile', testUserProfile)

module.exports = router