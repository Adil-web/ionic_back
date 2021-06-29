const Router = require('express')
const router = new Router()
const dispensingBlockController = require('../controller/dispensingBlock.controller')
const drugNameController = require('../controller/drugNameController')
const localityController = require('../controller/localityController')
const tareAccountingController = require('../controller/tareAccountingController')

router.post('/locality', localityController.getLocality)
router.post('/drugsName', drugNameController.getDrugName)
router.post('/dispensing', dispensingBlockController.createDispensing)
router.post('/tare', tareAccountingController.getTare)
// router.post('/dispensing', dispensingBlockController.createTest)
router.get('/test', dispensingBlockController.getAllTests)
// router.get('/user', dispensingBlockController.getUsers)
// router.get('/user/:id', dispensingBlockController.getOneUser)
// router.put('/user/:id', dispensingBlockController.updateUser)
// router.delete('/user/:id', dispensingBlockController.deleteUser)

module.exports = router