const { isEmpty } = require('lodash')

const { register, login, serialize } = require('../utils/Auth');
const Courses = require('../model/courses');


const registerEmployee = async (req, res) => {
    try {
        await register(req.body, 'employee', res);
    } catch (e) {
        console.log(`error while registering employee` + e)
    }

};

const registerAdmin = async (req, res) => {
    try {
        await register(req.body, 'admin', res);
    } catch (e) {
        console.log(`error while registering admin` + e)
    }

};

const registerSuperAdmin = async (req, res) => {
    try {
        await register(req.body, 'superadmin', res);
    } catch (e) {
        console.log(`error while registering Employee` + e)
    }

};

const loginEmployee = async (req, res) => {
    try {
        await login(req.body, 'employee', res);
    } catch (e) {
        console.log('error while login by employee')
    }
}

const loginAdmin = async (req, res) => {
    try {
        await login(req.body, 'admin', res);
    } catch (e) {
        console.log('error while login by admin')
    }
}

const loginSuperadmin = async (req, res) => {
    try {
        await login(req.body, 'superadmin', res);
    } catch (e) {
        console.log('error while login by superadmin')
    }
};

//employee 
const getAllApprovedCourses = async (req, res) => {
    try {
        const allApprovedCourses = await Courses.find({ isApproved: true }).sort({ category: 1 });
        return res.status(200).json(allApprovedCourses);

    } catch (e) {
        console.log(e);
        return res.status(400).json({
            message: `Error while fetching all approved courses details`,
            success: false
        })
    }
};

const getApprovedCourseByTitle = async (req, res) => {
    const { title } = req.params
    try {
        const approvedCourse = await Courses.findOne({ title, isApproved: true });
        return res.status(200).json(approvedCourse);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            message: `Error while fetching approved course by title`,
            success: false
        })
    }
};

const courseProgressByEmployee = async (req, res) => {
    const { title } = req.params;
    const { progressTime } = req.body
    try {
        const approvedCourse = await Courses.findOne({ title, isApproved: true });
        await courseProgressDetails(approvedCourse, progressTime, res)
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            message: `Error while getting the progress of the course,Error : ${e}`,
            success: false
        })
    }
};

//---------------------------------------------------------------------------------------

//admin,superadmin
const getAllCourses = async (req, res) => {
    try {
        const allCourse = await Courses.find().sort({ category: 1 });
        return res.status(200).json(allCourse);

    } catch (e) {
        console.log(e);
        return res.status(400).json({
            message: `Error while fetching all course details`,
            success: false
        })
    }
};

const getCourseByTitle = async (req, res) => {
    const { title } = req.params
    try {
        const course = await Courses.findOne({ title });
        return res.status(200).json(course)
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            message: `Error while fetching course by title`,
            success: false
        })
    }
};

const addCourse = async (req, res) => {
    const { title = '', description = '', videoUrl = '', topics = [], duration = 0, category = '' } = req.body
    try {
        const isCourseExist = await Courses.findOne({ title });

        if (isEmpty(isCourseExist)) {

            const createdCourse = await Courses.create({
                title,
                description,
                videoUrl,
                topics,
                duration,
                category,
                isApproved: false
            });

            return res.status(201).json({
                createdCourse,
                message: `Course ${title} is added successfully.`
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Course Already Exist with same title : ${title} in database.`
            });
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: `Error while adding course.`
        });
    }

};

const updateCourse = async (req, res) => {
    try {
        const { title } = req.params
        let updatedCourse = await Courses.findOneAndUpdate({ title }, {
            ...req.body,
            isApproved: false
        }, { new: true });
        return res.status(200).json({
            updatedCourse,
            message: `Course ${title} is updated successfully.`
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: `Error while updating course.`
        });

    }

};

const deleteCourse = async (req, res) => {
    const { title } = req.params;
    try {
        await Courses.findOneAndDelete({ title });
        return res.status(200).json({
            message: `Course with title ${title} is successfully deleted`,
            success: true
        });

    } catch (e) {
        return res.status(400).json({
            message: `Error while deleting a course`,
            success: false
        })
    }
};

const courseProgressData = async (req, res) => {
    try {
        const { title } = req.params;
        const { progressTime } = req.body

        const approvedCourse = await Courses.findOne({ title });
        await courseProgressDetails(approvedCourse, progressTime, res);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            message: `Error while getting the progress of the course, Error :${e}`,
            success: false
        })
    }
};

//superadmin
const approveCourse = async (req, res) => {
    try {
        const { title } = req.params;
        const approvedCourse = await Courses.findOneAndUpdate({ title }, { isApproved: true });

        return res.status(200).json({
            message: `Course ${title} is approved successfully.`
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: `Error while approving course.,error:${e}`
        });
    }
};

//---------------------------------------------------------------------------------

const courseProgressDetails = async (courseDetails, progressTime, res) => {
    let completionRatio;
    let progressMessage;
    if (!isEmpty(courseDetails)) {
        const { duration,title } = courseDetails;

        if (progressTime > duration) {
            return res.status(400).json({
            message: `progressTime can not be greater than duration`
        })
        };

        if ((progressTime <= duration) && (duration != 0)) {
            completionRatio = Number(progressTime) / Number(duration);
        };

        console.log(completionRatio)
        if (completionRatio == 0) {
            progressMessage = `Course ${title} is not started yet`
        } else if (completionRatio == 1) {
            progressMessage = `Course ${title} is successfully completed.`
        } else {
            progressMessage = `Course ${title} is ${completionRatio*100} % completed.`
        };
    }else{
        throw Error(`Course is not available or course is not approved`)
    }

    return res.status(200).json({
        completionPercentage:completionRatio*100,
        message: progressMessage
    });
};


module.exports = { registerEmployee, registerAdmin, registerSuperAdmin, loginEmployee, loginAdmin, loginSuperadmin,getAllCourses, getCourseByTitle, addCourse, updateCourse, deleteCourse, getAllApprovedCourses, getApprovedCourseByTitle, courseProgressByEmployee, courseProgressData, approveCourse }