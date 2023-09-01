require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./router');
const errorMiddleware = require('./middlewares/errorMiddleware');
const PORT = 8080;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use("/", authRouter);
app.use(express.static(getViewPath()));
app.use(cookieParser());

app.use(cors());

app.use(errorMiddleware);

app.engine('html', require('ejs').renderFile);
app.set('views', getViewPath());
app.set('view engine', 'html');

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://nilchenko2020:Nazar13579@cluster1.z0u9be0.mongodb.net/?retryWrites=true&w=majority');
        app.listen(PORT, () => console.log("Server started"));
    } catch (e) {
        console.log(e);
    }
}

start();

function getViewPath() {
    return __dirname.slice(0, -3) + "\\views";
}

