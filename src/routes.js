const SchoolController = require( "./controllers/SchoolController")
const SessionsController = require( "./controllers/SessionsController")
const EmployeeController = require( "./controllers/EmployeeController")
const ClassController = require( "./controllers/ClassController")
const StudentController = require( "./controllers/StudentController")
const MatterController = require( "./controllers/MatterContoller")
const ReportCardController = require( "./controllers/ReportCardController")

const auth = require ("./middlewares/auth")

const express = require('express')
const routes = express.Router()

routes.post('/register/school', SchoolController.create)
routes.post('/session/school', SessionsController.sessionSchool)
routes.post('/session/employee', SessionsController.sessionEmployee)

routes.use(auth)

routes.post('/register/employee/:id', EmployeeController.create)
routes.post('/register/class/:id', ClassController.create)
routes.post('/register/student/:id', StudentController.create)
routes.post('/add/student', ClassController.addStudent)
routes.post('/add/teacher', ClassController.addTeacher)
routes.post('/register/matter/:id', MatterController.create)
routes.post('/add/matter', MatterController.addMatter)
routes.post('/register/card', ReportCardController.create)

module.exports = routes