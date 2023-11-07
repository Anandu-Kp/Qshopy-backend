
// importing libraries
const express = require("express")
require("dotenv").config();
const cors = require("cors")


// importing files

require("./config/db")


// middlewares
const app = express();
app.use(express.json())
app.use(
    cors({
        origin: "*",
    })
);


// environement variables
const PORT = process.env.PORT;


// importing routes
const UserRoutes = require("./Routes/user")
const MerchantRoutes = require("./Routes/merchant")
const ProductRoutes = require("./Routes/product")


// routes

app.use("/user", UserRoutes)
app.use("/merchant", MerchantRoutes)
app.use("/product", ProductRoutes)




app.listen(PORT, () => {
    console.log("server is running on port :", PORT);
})
