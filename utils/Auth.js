
const passport = require('passport');
const Employees = require('../model/employee');

const register = async (userDetails, role, res) => {
    try {
        let {username,email}=userDetails;
        let userNameExist = await validateUsername(username)

        if (userNameExist) {
            return res.status(400).json({
                message: `Username ${username} already exist.`,
                success: false
            });
        }

        let userEmailExist = await validateEmail(email)
        if (userEmailExist) {
            return res.status(400).json({
                message: `Email ${email} already exist.`,
                success: false
            });
        };

        const newUser = await Employees.create({
            ...userDetails,
            role
        });

        return res.status(201).json({
            message: `Successfully registered.`,
            success: true,
            newUser
        })
    } catch (e) {
        console.log(`failed to register`)
        return res.status(201).json({
            message: `Unable to create your account`,
            success: false
        })
    }
};

const login = async (userCredentials, role, res) => {
    try {
        let { username, password } = userCredentials;

        const user = await Employees.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: 'Username is not found.',
                success: false
            })
        };

        if (user && user.role != role) {
            return res.status(403).json({
                message: 'Please make sure you are login from the right portal',
                success: false
            })
        };

        if (user && !await user.comparePassord(password)) {
            return res.status(401).json({
                message: 'Incorrect Password',
                success: false
            })
        };

        //if user are able to login then jwt sign token
        let token = await user.generateJWT()
        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        }

        return res.status(200).json({
            user: result,
            message: 'You are now loged in.',
            success: true
        })
    } catch (e) {
        console.log('error while login.')
        return res.status(400).json({
            message: 'error while login.',
            success: false
        })
    }
};

const validateUsername = async (username) => {
    let user = await Employees.findOne({ username })
    return user ? true : false
};

const validateEmail = async (email) => {
    let user = await Employees.findOne({ email });
    return user ? true : false
};

//just removing password in res.
const serialize = (user) => {
    return {
        username: user.username,
        email: user.email,
        name: user.name,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    }
};

const checkRole = (roles) => (req, res, next) => !roles.includes(req.user.role) ? res.status(401).json({ message: "Unauthorized", success: false }) : next();

//to protect route-> now calling protected route(used this as middleware) then have to use jwt bearer token in postman headers.
const userAuthentication = passport.authenticate('jwt', { session: false });
// other options are available like redirecting etc.


module.exports = { register, login, userAuthentication, serialize ,checkRole}