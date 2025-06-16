const EducationDepartmentController = require( "./controllers/EducationDepartmentController")
const SchoolController = require( "./controllers/SchoolController")
const SessionsController = require( "./controllers/SessionsController")
const EmployeeController = require( "./controllers/EmployeeController")
const ClassController = require( "./controllers/ClassController")
const StudentController = require( "./controllers/StudentController")
const MatterController = require( "./controllers/MatterContoller")
const ReportCardController = require( "./controllers/RepoCardController")
const DailyController = require( "./controllers/DailyController")
const FinalConcepts = require( "./controllers/FinalConcepts")
const AttendanceController = require( "./controllers/AttendanceController")
const BimonthlyController = require( "./controllers/BimonthlyController")
const GradeController = require( "./controllers/GradeController")
const IndividualFormController = require( "./controllers/IndividualFormController")
const RefreshController = require( "./controllers/RefreshController")

const auth = require ("./middlewares/auth")

const express = require('express')
const routes = express.Router()

routes.post('/register/education-department', EducationDepartmentController.create)
routes.post('/register/school', SchoolController.create)
routes.post('/session/education-department', SessionsController.sessionEducationDepartment)
routes.post('/session/employee-education-department', SessionsController.sessionEmployeeEducationDepartment)
routes.post('/session/school', SessionsController.sessionSchool)
routes.post('/session/employee', SessionsController.sessionEmployee)
routes.post('/forgot-password-education-department', EducationDepartmentController.ForgotPasswordEduDep)
routes.post('/forgot-password', EmployeeController.ForgotPassword)
routes.post('/reset-password-education-department', EducationDepartmentController.ResetPasswordEducationDepartment )
routes.post('/reset-password', EmployeeController.ResetPassword )
routes.post('/update-password', EmployeeController.updatePassword )
routes.post('/update-password-emp-edu-dep', EducationDepartmentController.updatePassword )
routes.post('/login-with-school', SessionsController.loginWithSchool)
routes.post('/refresh/employee', RefreshController.checkToken)
routes.post('/refresh/employee-dep-edu', RefreshController.checkTokenEduDep)

routes.post('/school/index', SchoolController.index)
routes.post('/education-department/index-name', EducationDepartmentController.indexName)
routes.post('/index-schools', SchoolController.indexSchools)

routes.use(auth)

routes.post('/index-info', EducationDepartmentController.index)
routes.post('/index-school', EducationDepartmentController.indexSchool)

routes.post('/get/school', SchoolController.getSchool)

routes.post('/register/employee/:id', EmployeeController.create)
routes.post('/register/employee-education-department/:id', EducationDepartmentController.NewEmpEducationDepartament)

routes.post('/register/class/:id', ClassController.create)

routes.post('/register/student/:id', StudentController.create)

routes.post('/add/student', ClassController.addStudent)
routes.post('/reassign-student', ClassController.ReassignStudent)
routes.post('/returned-studen', ClassController.returnedStudent)

routes.post('/add/teacher', ClassController.addTeacher)
routes.post('/add/teacher02', ClassController.addTeacher02)
routes.post('/add/physicalEducationTeacher', ClassController.addPhysicalTeacher)
routes.post('/remove/physicalEducationTeacher', ClassController.removePhysicalTeacher)

routes.post('/register/matter/:id', MatterController.create)
routes.post('/add/matter', MatterController.addMatter)
routes.post('/update/matter', MatterController.update)

routes.post('/register/Daily', DailyController.create)

routes.post('/register/card', ReportCardController.create)
routes.post('/allTheBulletins-grades', ReportCardController.allTheBulletinsGrades)
//routes.post('/allTheFinalBulletins-grades', ReportCardController.allTheFinalBulletinsGrades)
routes.post('/allTheBulletins-concept', ReportCardController.allTheBulletinsConcept)
routes.post('/allTheFinalBulletins-concept', ReportCardController.allTheFinalBulletinsConcept)

routes.post('/register/final-concepts', FinalConcepts.create)
routes.post('/get/final-concepts', FinalConcepts.GetGradeFinalConcepts)
routes.post('/get/card-final-concepts', FinalConcepts.GetFinalConcepts)
routes.post('/update/final-concepts', FinalConcepts.update)

routes.post('/final-concepts/daily', FinalConcepts.FinalConceptsDaily)
routes.post('/final-concepts/daily-teacher02', FinalConcepts.FinalConceptsDailyTeacher02)

routes.post('/register/istQuarter', BimonthlyController.createI_stQuarter)
routes.post('/register/istQuarter_grade', BimonthlyController.createI_stQuarter$$grade)
routes.post('/index/istQuarter', BimonthlyController.indexI_stQuarter)
routes.get('/details/istQuarter/:id', BimonthlyController.getI_stQuarterById)
routes.post('/update/istQuarter/:id', BimonthlyController.updateI_stQuarter)

routes.post('/register/iindQuarter', BimonthlyController.createII_ndQuarter)
routes.post('/register/iindQuarter_grade', BimonthlyController.createII_ndQuarter$$grade)
routes.post('/index/iindQuarter', BimonthlyController.indexII_ndQuarter)
routes.get('/details/iindQuarter/:id', BimonthlyController.getII_ndQuarterById)
routes.post('/update/iindQuarter/:id', BimonthlyController.updateII_ndQuarter)

routes.post('/register/iii_rdQuarter', BimonthlyController.createIII_rdQuarter)
routes.post('/register/iii_rdQuarter_grade', BimonthlyController.createIII_rdQuarter$$grade)
routes.post('/index/iii_rdQuarter', BimonthlyController.indexIII_rdQuarter)
routes.get('/details/iiirdQuarter/:id', BimonthlyController.getIII_rdQuarterById)
routes.post('/update/iiirdQuarter/:id', BimonthlyController.updateIII_rdQuarter)

routes.post('/register/iv_thQuarter', BimonthlyController.createIV_thQuarter)
routes.post('/register/iv_thQuarter_grade', BimonthlyController.createIV_thQuarter$$grade)
routes.post('/index/iv_thQuarter', BimonthlyController.indexIV_thQuarter)
routes.get('/details/ivthQuarter/:id', BimonthlyController.getIV_thQuarterById)
routes.post('/update/ivthQuarter/:id', BimonthlyController.updateIV_thQuarter)

routes.post('/register/v_thQuarter', BimonthlyController.createV_thQuarter)
routes.post('/index/v_thQuarter', BimonthlyController.indexV_thQuarter)
routes.get('/details/vthQuarter/:id', BimonthlyController.getV_thQuarterById)
routes.post('/update/vthQuarter/:id', BimonthlyController.updateV_thQuarter)
routes.post('/register/vi_thQuarter', BimonthlyController.createVI_thQuarter)
routes.post('/index/vi_thQuarter', BimonthlyController.indexVI_thQuarter)
routes.get('/details/vithQuarter/:id', BimonthlyController.getVI_thQuarterById)
routes.post('/update/vithQuarter/:id', BimonthlyController.updateVI_thQuarter)

routes.post('/reopen_i_stQuarter/:id', BimonthlyController.reopenI_stQuarter)
routes.post('/toclose_i_stQuarter/:id', BimonthlyController.tocloseI_stQuarter)
routes.post('/reopen_ii_ndQuarter/:id', BimonthlyController.reopenII_ndQuarter)
routes.post('/toclose_ii_ndQuarter/:id', BimonthlyController.tocloseII_ndQuarter)
routes.post('/reopen_iii_rdQuarter/:id', BimonthlyController.reopenIII_rdQuarter)
routes.post('/toclose_iii_rdQuarter/:id', BimonthlyController.tocloseIII_rdQuarter)
routes.post('/reopen_iv_thQuarter/:id', BimonthlyController.reopenIV_thQuarter)
routes.post('/toclose_iv_thQuarter/:id', BimonthlyController.tocloseIV_thQuarter)

routes.post('/create-activity', GradeController.createActivity)
routes.post('/get-activity', GradeController.GetActivity)
routes.post('/update-avaliacao', GradeController.updateAvaliação)
routes.post('/destroy-activity', GradeController.DestroyActivity)
routes.post('/get-grade-activity', GradeController.GetGradeActivity)

routes.post('/register/grade', GradeController.createGrade)
routes.post('/register/numerical-grade', GradeController.createNumericalGrade)

routes.post('/update/grade', GradeController.update)
routes.post('/update/numerical-grade', GradeController.updateNumericalGrade)

routes.post('/index/gradei', GradeController.indexIstQuarter)
routes.post('/index/numerical-gradei', GradeController.indexNumericalIstQuarter)
routes.post('/index/numerical-gradeii', GradeController.indexNumericalIIndQuarter)
routes.post('/index/numerical-gradeiii', GradeController.indexNumericalIIIrdQuarter)
routes.post('/index/numerical-gradeiv', GradeController.indexNumericalIVthQuarter)

routes.post('/index/gradeii', GradeController.indexIIndQuarter)
routes.post('/index/gradeiii', GradeController.indexIIIrdQuarter)
routes.post('/index/gradeiv', GradeController.indexIVthQuarter)
routes.post('/index/gradev', GradeController.indexVthQuarter)
routes.post('/index/gradevi', GradeController.indexVIthQuarter)

routes.post('/get-numerical-grade', GradeController.GetNumericalGrade)
routes.post('/get-num-grade', GradeController.GetNumGrade)
routes.post('/get-grade', GradeController.GetGrade)

routes.post('/grade-daily', GradeController.IndexGradeDaily)
routes.post('/activities-daily', GradeController.IndexActivitiesDaily)
routes.post('/grade-daily-teacher02', GradeController.IndexGradeDailyTeacher02)
routes.post('/numerical-grade-daily', GradeController.IndexNumericalGradeDaily)

routes.post('/numerical-grades-card', GradeController.indexNumericalGradesCard)
routes.post('/grades-card', GradeController.indexGradesCard)

routes.post('/grades', GradeController.indexGrades)

/*routes.post('/card/I_st_quarter', ReportCardController.I_st_quarter)
routes.post('/card/II_nd_quarter', ReportCardController.II_nd_quarter)
routes.post('/card/III_rd_quarter', ReportCardController.III_rd_quarter)
routes.post('/card/IV_th_quarter', ReportCardController.IV_th_quarter)*/

routes.post('/employee', EmployeeController.index)
routes.post('/employee-dep-edu', EducationDepartmentController.indexEmpEduDep)
routes.get('/employee-details/:id', EmployeeController. getEmployeeById)
routes.get('/employee-details-edu-dep/:id', EducationDepartmentController. getEmployeeDepEduById)
routes.post('/employee-update/:id', EmployeeController.updateEmployee)
routes.post('/employee-edu-dep-update/:id', EducationDepartmentController.updateEmployee)

routes.post('/record-class-taught', EmployeeController.RecordClassTaught)
routes.post('/destroy/class', EmployeeController.DestroyClass)
routes.post('/index-record-class', EmployeeController.indexRecordClassTaught)
routes.post('/update-record-class', EmployeeController.updateRecordClassTaught)
routes.post('/update-record-class/adm', EmployeeController.updateRecordClassTaughtADM)
routes.post('/record-class-daily', EmployeeController.RecordClassTaughtDaily)
routes.get('/check-employee/:cpf', EmployeeController.EmpExist)

routes.get('/student-details/:id', StudentController. getStudentById)
routes.post('/student-update/:id', StudentController.updateStudent)
routes.post('/status-update', StudentController.updateStatus)

routes.get('/class-details/:id', ClassController.getclassById)
routes.post('/class-update/:id', ClassController.updateClass)
routes.post('/student', StudentController.index)
routes.post('/class', ClassController.index)
routes.post('/matter', MatterController.index)
routes.get('/getMatter/:id', MatterController.getMatter)

routes.post('/student/info/:id', StudentController.InfoIndex)
routes.post('/employee-education-department/info/:id', EducationDepartmentController.InfoIndexEduDep)
routes.post('/employee/info/:id', EmployeeController.InfoIndex)
routes.post('/class/info/:id', ClassController.InfoIndex)

routes.post('/myclass', EmployeeController.MyClassIndex)

routes.post('/test-attendance', AttendanceController.testcreateArrayAttendance)
routes.post('/test-index', AttendanceController.testindex)
routes.post('/test-destroy', AttendanceController.destroyArrayAttendance)

routes.post('/attendance', AttendanceController.createAttendance)
routes.post('/attendance/index', StudentController.AttendanceIndex)
routes.post('/search/frequency', AttendanceController.index)
routes.post('/update/frequency', AttendanceController.update)
routes.post('/destroy/frequency', AttendanceController.DestroyAttendance)
routes.post('/attendance-bimonthly', AttendanceController.AttendanceBimonthly)
routes.post('/attendance-final-concepts', AttendanceController.AttendanceFinalConcepts)
routes.post('/Attendance-by-teacher-class', AttendanceController.AttendanceByTeacherAndClass)

routes.post('/destroy-employee/:id', EmployeeController.destroy)
routes.post('/destroy-student/:id', StudentController.destroy)
routes.post('/remove/student', ClassController.removeStudent)
routes.post('/remove/teacher', ClassController.removeTeacher)
routes.post('/remove/teacher02', ClassController.removeTeacher02)
routes.post('/remove/matter', MatterController.removeMatter)

routes.post('/create-individual-form', IndividualFormController.createIndividualForm)
routes.post('/index-individual-form', IndividualFormController.IndexIndividualForm)
routes.get('/get-individual-form/:id', IndividualFormController.GetIndividualForm)
routes.post('/form-edit', IndividualFormController.update)
routes.post('/destroy/form', IndividualFormController.DestroyForm)

routes.post('/delete/matter', MatterController.deleteMatter)

//Rotas de controle de imagens

const postFileLogo = require("./models/postFileLogo");
const School = require("./models/School")

const multer = require('multer')
const multerConfig = require('./config/multer')

routes.post("/post-file-logo/:id", multer(multerConfig).single("file"), async (req, res) => {

    const { originalname: name, size, key, location: url = "" } = req.file;
    
    const { id } = req.params;

    const post = new postFileLogo({
        name,
        size,
        key,
        url,
        id_school: id
    });

    try {
        const postLogo = await post.save()
        await School.updateOne({
            _id: id
        }, {
            $push: {
                logo: postLogo._id   
            }
        })
        res.status(200).json({
            msg: ' sucesso.'
        })
    } catch (err){
        res.status(500).json({
            msg: 'Error.'
        })
    }
});

routes.post("/get-logo", async (req, res) => {

    const { idlogo } = req.body;

    const logo = await postFileLogo.findOne({ _id: idlogo });

    console.log(logo)
    //const posts = await PostFile.find();
    const Logo = logo
    return res.json({
        Logo
    });
});

routes.delete("/delete-logo/:id", async (req, res) => {
    
    const fs = require("fs");
    const path = require("path");
    const { promisify } = require("util");
    const aws = require("aws-sdk");

    const s3 = new aws.S3();
    const { id_school } = req.body
    const { id } = req.params;

    const posts = await postFileLogo.findById(id);
  
    await School.updateOne({
        _id: id_school
    }, {
        $pull: {
            logo: posts._id      
        }
    })
    
    await posts.deleteOne();

    if (process.env.STORAGE_TYPE === "s3") {
        s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: posts.key
        })
        .promise()
        .then(response => {
            console.log(response.status);
        })
        .catch(response => {
            console.log(response.status);
        });
        return res.send();
    } else {
        promisify(fs.unlink)(
          path.resolve(__dirname,  "..", "tmp", "uploads", posts.key)
        )
        return res.send();
    }
});


module.exports = routes