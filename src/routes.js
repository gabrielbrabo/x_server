const SchoolController = require( "./controllers/SchoolController")
const SessionsController = require( "./controllers/SessionsController")
const EmployeeController = require( "./controllers/EmployeeController")
const ClassController = require( "./controllers/ClassController")

const auth = require ("./middlewares/auth")

const express = require('express')
const routes = express.Router()

routes.post('/register/school', SchoolController.create)
routes.post('/session/school', SessionsController.sessionSchool)
routes.post('/session/employee', SessionsController.sessionEmployee)

routes.use(auth)

routes.post('/register/employee/:id', EmployeeController.create)
routes.post('/register/class/:id', ClassController.create)

module.exports = routes