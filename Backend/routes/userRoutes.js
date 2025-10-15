const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware.js');
const userRouter = express.Router();


userRouter.post('/register',registerUser,()=>{console.log("got request2")});
userRouter.post('/login',loginUser);
userRouter.get('/profile',authMiddleware,getUser);

module.exports = userRouter;