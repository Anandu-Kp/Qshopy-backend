const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI)
    .then((res) => {
        console.log("MONGO DB Connected");
    })
    .catch((err) => {
        console.log(err);
    })