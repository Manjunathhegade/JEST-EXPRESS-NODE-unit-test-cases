const express = require("express");
const Router = express.Router();
const userController = require("../controllers/user.controller")
const Auth = require("../middleware/auth")

// user creation 
Router.post('/signin',userController.signin)

// get all user
Router.get('/users',userController.users)

// user login
Router.post('/login',userController.login)

// get user by id
Router.get('/users/:id',Auth,userController.user)

// reset password : password should not be the same as last 3 password with respective of id
Router.post('/reset',Auth,userController.reset)

// add address
Router.put('/address/:id',Auth,userController.address)

// get all address by user id
Router.get('/address/:id',Auth,userController.userAddress)

module.exports = Router;