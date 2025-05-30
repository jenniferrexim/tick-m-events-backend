require("dotenv").config()
const express = require('express')
const cors = require('cors')
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const { connectToDB } = require("./database/db")
const { routesLists } = require("./utils/routerList")
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// server init
const server = express()

// database connection
connectToDB()
server.use(express.json())
server.use(cookieParser())
server.use(morgan("tiny"))
server.use(bodyParser.urlencoded({ extended: true }));
server.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
// middlewares
server.use(cors(
    {
        origin: [process.env.ORIGIN, process.env.ADMIN_ORIGIN],
        credentials: true,
        exposedHeaders: ['X-Total-Count'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    })
)



// Dynamically register routes
for (const [prefix, router] of Object.entries(routesLists)) {
    server.use(prefix, router);
}

server.get("/", (req, res) => {
    res.status(200).json({ message: 'running' })
})

server.listen(8000, () => {
    console.log('server [STARTED] ~ http://localhost:8000');
})