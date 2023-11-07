const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../Models/User")


const SALTED_ROUNDS = process.env.SALTED_ROUNDS;

const userRegister = async (req, res) => {
    const isValid = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        address: Joi.string().required(),
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }


    try {
        const userExists = await User.find({
            $or: [{ email: req.body.email, phone: req.body.phone }],
        });

        if (userExists.length != 0) {
            return res.status(400).send({
                status: 400,
                message: "Phone Number/Email already exists",
            });
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to check username/phone",
            data: error
        })

    }


    const hashedPassword = await bcrypt.hash(req.body.password, 17);

    const userDetails = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword
    }
    const userData = new User(userDetails)

    // try for saving user data
    try {
        await userData.save();
        const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY);
        return res.status(201).send({
            status: 201,
            message: "user created successfully",
            data: { token }
        })
    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to register user",
            data: error
        })

    }


}

const userLogin = async (req, res) => {
    const isValid = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(req.body);

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }

    let userData;
    try {

        userData = await User.findOne({ email: req.body.email });
        if (!userData) {
            return res.status(400).send({
                status: 400,
                message: "No account on this email, please signup"
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch user details",
            data: error
        })
    }

    const isUserMatching = await bcrypt.compare(req.body.password, userData.password);

    if (!isUserMatching) {
        return res.status(401).send({
            status: 401,
            message: "incorrect password"
        })
    }
    const payload = {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        userId: userData._id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    res.status(201).send({
        status: 201,
        message: "logged in successfully",
        data: { token }
    })
}

const editUser = async (req, res) => {
    const userId = req.locals.userId;

    // checking the user exist or not
    try {
        const userExists = await User.findById(userId)

        if (!userExists) {
            return res.status(400).send({
                status: 400,
                message: "user not exist",
            });
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to check username/phone",
            data: error
        })

    }

    const userDetails = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
    }



    // updating user data
    try {
        await User.findByIdAndUpdate(userId, userDetails)
        return res.status(200).send({
            status: 200,
            message: "updated successfully",
        })




    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to update ",
            data: error
        })

    }

}

const getUser = async (req, res) => {


    let userId = req.locals.userId;

    // fetching user Details
    let userObj;
    try {
        userObj = await User.findById(userId);
        if (!userId) {
            res.status(400).send({
                status: 400,
                message: "user Doesn,t Exist"
            })
        }

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "failed to fetch user details",
            data: err
        })
    }

    const userDetails = {
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        address: userObj.address
    }

    res.status(200).send({
        status: 200,
        message: "fetched successfully",
        data: userDetails
    })

}

module.exports = { userRegister, userLogin, editUser, getUser }