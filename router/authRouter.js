const Router = require('express')
const router = new Router()
const controller = require('../controller/authController')
// const { check } = require('express-validator')
// const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// router.post('/register', [
//         check('username', "Имя пользователя не может быть пустым").notEmpty(),
//         check('password', "Пороль должен быть больше 4 и меньше 10 символов").isLength({min: 4, max: 10}),
//     ], controller.registration)
router.post('/login', controller.login)
// router.post('/tlogin', controller.testLogin)
router.post('/user', controller.getUser)
router.post('/users', controller.getUsers)
router.get('/dicts', authMiddleware, controller.getDicts)

module.exports = router
