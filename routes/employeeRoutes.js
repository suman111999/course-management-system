const express = require('express');

const router = express.Router();

const { userAuthentication, serialize, checkRole } = require('../utils/Auth');
const { registerEmployee, registerAdmin, registerSuperAdmin, loginEmployee, 
    loginAdmin, loginSuperadmin, getAllCourses, 
    getCourseByTitle, addCourse, updateCourse, deleteCourse,getAllApprovedCourses, getApprovedCourseByTitle, 
    courseProgressByEmployee, courseProgressData,approveCourse } = require('../controller/employeeController');

router.post("/register/employee", registerEmployee);
router.post("/register/admin", registerAdmin);
router.post("/register/superadmin", registerSuperAdmin)

router.post("/login/employee", loginEmployee);
router.post("/login/admin", loginAdmin);
router.post("/login/superadmin", loginSuperadmin);

//for all
router.get("/profile", userAuthentication, async (req, res) => {
    return res.json(serialize(req.user))
});

//employee
router.get("/employee/list", userAuthentication, checkRole(['employee']),getAllApprovedCourses );
router.get("/employee/list/:title", userAuthentication, checkRole(['employee']),getApprovedCourseByTitle );
router.post("/employee/course-progress/:title", userAuthentication, checkRole(['employee']),courseProgressByEmployee );

//admin,superadmin
router.get("/superadmin-admin/list", userAuthentication, checkRole(['superadmin','admin']), getAllCourses);
router.get("/superadmin-admin/list/:title", userAuthentication, checkRole(['superadmin','admin']), getCourseByTitle);
router.post("/superadmin-admin/add", userAuthentication, checkRole(['superadmin','admin']), addCourse);
router.put("/superadmin-admin/update/:title", userAuthentication, checkRole(['superadmin','admin']), updateCourse);
router.delete("/superadmin-admin/delete/:title", userAuthentication, checkRole(['superadmin','admin']), deleteCourse);
router.post("/superadmin-admin/course-progress/:title", userAuthentication, checkRole(['superadmin','admin']), courseProgressData);

//superadmin
router.put("/superadmin/approve-course/:title", userAuthentication, checkRole(['superadmin']),approveCourse);


module.exports = router;