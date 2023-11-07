const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Merchant = require("../Models/Merchant")


const merchantRegister = async (req, res) => {
    const isValid = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        location: Joi.string().required(),
        company: Joi.string().required(),
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }


    try {
        const merchantExists = await Merchant.find({
            $or: [{ email: req.body.email, phone: req.body.phone }],
        });

        if (merchantExists.length != 0) {
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

    console.log(process.env.SALTED_ROUNDS);

    const hashedPassword = await bcrypt.hash(req.body.password, Number(process.env.SALTED_ROUNDS));

    const merchantDetails = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        password: hashedPassword,
        company: req.body.company
    }
    const merchantData = new Merchant(merchantDetails)

    // try for saving user data
    try {
        await merchantData.save();
        const token = jwt.sign(merchantDetails, process.env.JWT_SECRET_KEY);
        return res.status(201).send({
            status: 201,
            message: "merchant created successfully",
            data: { token }
        })
    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to register merchant",
            data: error
        })

    }
}


const merchantLogin = async (req, res) => {
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

    let merchantData;
    try {

        merchantData = await Merchant.findOne({ email: req.body.email });
        if (!merchantData) {
            return res.status(400).send({
                status: 400,
                message: "No account on this email, please signup"
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch merchant details",
            data: error
        })
    }

    const isMerchantMatching = await bcrypt.compare(req.body.password, merchantData.password);

    if (!isMerchantMatching) {
        return res.status(401).send({
            status: 401,
            message: "incorrect password"
        })
    }
    const payload = {
        name: merchantData.name,
        phone: merchantData.phone,
        email: merchantData.email,
        location: merchantData.location,
        userId: merchantData._id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    res.status(201).send({
        status: 201,
        message: "logged in successfully",
        data: { token }
    })
}

const editMerchant = async (req, res) => {
    const userId = req.locals.userId;

    // checking the user exist or not
    try {
        const merchantExists = await Merchant.findById(userId)

        if (!merchantExists) {
            return res.status(400).send({
                status: 400,
                message: "merchant not exist",
            });
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to check username/phone",
            data: error
        })

    }

    const merchantDetails = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        company: req.body.company
    }



    // updating data
    try {
        await Merchant.findByIdAndUpdate(userId, merchantDetails)
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
const getMerchant = async (req, res) => {


    let userId = req.locals.userId;

    // fetching Details
    let merchantObj;
    try {
        merchantObj = await Merchant.findById(userId);
        if (!userId) {
            res.status(400).send({
                status: 400,
                message: "merchant Doesn,t Exist"
            })
        }

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "failed to fetch user details",
            data: err
        })
    }

    const merchantDetails = {
        name: merchantObj.name,
        email: merchantObj.email,
        phone: merchantObj.phone,
        location: merchantObj.location,
        company: merchantObj.company

    }

    res.status(200).send({
        status: 200,
        message: "fetched successfully",
        data: merchantDetails
    })

}

module.exports = { merchantRegister, merchantLogin, editMerchant, getMerchant }