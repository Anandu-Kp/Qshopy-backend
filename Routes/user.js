const express = require("express");
const { userRegister, userLogin, editUser, getUser } = require("../Controllers/UserController");
const { Auth } = require("../Middlewares/Auth");
const app = express();

app.post("/register", userRegister)

app.post("/login", userLogin)
app.put("/edit", Auth, editUser)
app.get("/get-user", Auth, getUser)


module.exports = app;