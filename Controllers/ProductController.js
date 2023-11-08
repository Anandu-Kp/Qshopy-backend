const Joi = require("joi");
const Product = require("../Models/Product");

const addProduct = async (req, res) => {
    const userId = req.locals.userId;
    console.log(req.locals);
    const isValid = Joi.object({
        name: Joi.string().required(),
        category: Joi.string().required(),
        sub_category: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }

    const productDetails = {
        name: req.body.name,
        category: req.body.category,
        sub_category: req.body.sub_category,
        price: req.body.price,
        location: req.body.location,
        merchant_id: userId
    }

    const productData = new Product(productDetails)
    try {
        await productData.save();
        return res.status(201).send({
            status: 201,
            message: "product added successfully"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to add product",
            data: error
        })

    }
}

const editProduct = async (req, res) => {
    const userId = req.locals.userId;
    const productId = req.params.productId;

    // check the product belongs to this merchant

    try {
        const isProductExists = await Product.findOne({ _id: productId, merchant_id: userId })
        if (!isProductExists) {
            return res.status(400).send({
                status: 400,
                message: "product not availible",
                data: error
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch product details",
            data: error
        })
    }


    const productDetails = {
        name: req.body.name,
        category: req.body.category,
        sub_category: req.body.sub_category,
        price: req.body.price,
        location: req.body.location
    }
    try {
        await Product.findByIdAndUpdate(productId, productDetails);
        return res.status(201).send({
            status: 201,
            message: "product updated successfully"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to update product",
            data: error
        })

    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.locals.userId;

    // check the product belongs to this merchant

    try {
        const isProductExists = await Product.findOne({ _id: productId, merchant_id: userId })
        if (!isProductExists) {
            return res.status(400).send({
                status: 400,
                message: "product not availible",
                data: error
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch product details",
            data: error
        })
    }

    try {
        console.log("not deleted");
        await Product.findByIdAndDelete(productId)
        console.log("deleted");
        return res.status(200).send({
            status: 200,
            message: "succesfully deleted product"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to delete product",
            data: error
        })
    }
}

// for merchant profile
const getProductsOfMerchant = async (req, res) => {
    const userId = req.locals.userId;

    try {

        const productList = await Product.find({ merchant_id: userId });
        if (productList.length == 0) {
            return res.status(204).send({
                status: 204,
                message: "no products to show"
            })
        }
        else {
            return res.status(200).send({
                status: 200,
                message: "successfully fetched products",
                data: productList
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch merchant's products",
            data: error
        })
    }
}

// for user dashboard
const getAllProducts = async (req, res) => {

    try {

        const productList = await Product.find();
        if (productList.length == 0) {
            return res.status(204).send({
                status: 204,
                message: "no products to show"
            })
        }
        else {
            return res.status(200).send({
                status: 200,
                message: "successfully fetched products",
                data: productList
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch merchant's products",
            data: error
        })
    }
}

const getFilteredProducts = async (req, res) => {
    const { category, sub_category } = req.body;

    try {

        const productList = sub_category ? await Product.find({ category, sub_category }) : await Product.find({ category });
        if (productList.length == 0) {
            return res.status(200).send({
                status: 200,
                message: "no products to show"
            })
        }
        else {
            return res.status(200).send({
                status: 200,
                message: "successfully fetched products",
                data: productList
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch merchant's products",
            data: error
        })
    }
}

module.exports = { addProduct, editProduct, deleteProduct, getProductsOfMerchant, getAllProducts, getFilteredProducts }