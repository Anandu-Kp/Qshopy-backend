const express = require("express");
const { merchantRegister, merchantLogin, editMerchant, getMerchant } = require("../Controllers/MerchantController");
const { Auth } = require("../Middlewares/Auth");
const app = express();


app.post("/register", merchantRegister)
app.post("/login", merchantLogin)
app.put("/edit", Auth, editMerchant)
app.get("/get-merchant", Auth, getMerchant)


module.exports = app;