const express = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();


  router.post('/register', UserController.registerController);
  router.post('/login', UserController.loginController);
  

router.get('/users', UserController.getAllUsersController);
router.get('/users/:id', UserController.getUserByIdController);
router.put('/users/:id', UserController.updateUserController);
router.delete('/users/:id', UserController.deleteUserController);

module.exports = router;