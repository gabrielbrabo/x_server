const SchoolController = require( "./controllers/SchoolController")
const SessionsController = require( "./controllers/SessionsController")
const EmployeeController = require( "./controllers/EmployeeController")
const ClassController = require( "./controllers/ClassController")
const StudentController = require( "./controllers/StudentController")
const MatterController = require( "./controllers/MatterContoller")
const ReportCardController = require( "./controllers/RepoCardController")

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
routes.post('/card/I_st_quarter', ReportCardController.I_st_quarter)
routes.post('/card/II_nd_quarter', ReportCardController.II_nd_quarter)
routes.post('/card/III_rd_quarter', ReportCardController.III_rd_quarter)
routes.post('/card/IV_th_quarter', ReportCardController.IV_th_quarter)

module.exports = routes