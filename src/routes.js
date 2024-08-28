const SchoolController = require( "./controllers/SchoolController")
const SessionsController = require( "./controllers/SessionsController")
const EmployeeController = require( "./controllers/EmployeeController")
const ClassController = require( "./controllers/ClassController")
const StudentController = require( "./controllers/StudentController")
const MatterController = require( "./controllers/MatterContoller")
const ReportCardController = require( "./controllers/RepoCardController")
const AttendanceController = require( "./controllers/AttendanceController")
const RefreshController = require( "./controllers/RefreshController")

const auth = require ("./middlewares/auth")

const express = require('express')
const routes = express.Router()

routes.post('/register/school', SchoolController.create)
routes.post('/session/school', SessionsController.sessionSchool)
routes.post('/session/employee', SessionsController.sessionEmployee)
routes.post('/refresh/employee', RefreshController.checkToken)

routes.post('/school/index', SchoolController.index)

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

routes.post('/employee', EmployeeController.index)
routes.get('/employee-details/:id', EmployeeController. getEmployeeById)
routes.post('/employee-update/:id', EmployeeController.updateEmployee)
routes.post('/student', StudentController.index)
routes.post('/class', ClassController.index)
routes.post('/matter', MatterController.index)

routes.post('/student/info/:id', StudentController.InfoIndex)
routes.post('/employee/info/:id', EmployeeController.InfoIndex)
routes.post('/class/info/:id', ClassController.InfoIndex)

routes.post('/myclass', EmployeeController.MyClassIndex)
routes.post('/attendance', StudentController.createAttendance)
routes.post('/attendance/index', StudentController.AttendanceIndex)
routes.post('/search/frequency', AttendanceController.index)
routes.post('/update/frequency', AttendanceController.update)

routes.post('/destroy-employee/:id', EmployeeController.destroy)
routes.post('/remove/student', ClassController.removeStudent)
routes.post('/remove/teacher', ClassController.removeTeacher)
routes.post('/remove/matter', MatterController.removeMatter)

routes.post('/delete/matter', MatterController.deleteMatter)

module.exports = routes