const express = require("express");
const { addProduct, editProduct, deleteProduct, getProductsOfMerchant, getAllProducts, getFilteredProducts } = require("../Controllers/ProductController");
const { Auth } = require("../Middlewares/Auth");
const app = express();

app.post("/add", Auth, addProduct)
app.put("/edit/:productId", Auth, editProduct)
app.delete("/delete/:productId", Auth, deleteProduct)
app.get("/get-user-products", Auth, getProductsOfMerchant)
app.get("/get-products", Auth, getAllProducts)
app.get("/get-filtered-products", Auth, getFilteredProducts)

module.exports = app;