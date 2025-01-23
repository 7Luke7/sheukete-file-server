const express = require("express")
const cors = require("cors")
const port = 5555
const router = require("./routes/router")
const fs = require('node:fs');
const dotenv = require("dotenv")
const path = require("path")

const app = express()

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4321', 'http://localhost:4322'],
    credentials: true,
})) 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(router)
app.use('/static/images', express.static(path.join(__dirname, '/images')), (req, res, next) => {
  const default_image_path = path.join(
    __dirname + `/images/default_profile.png`
  );
  res.sendFile(default_image_path)
});

const start_server = async () => {
    try {
        if (!fs.existsSync("images")) {
          fs.mkdirSync("images");
        }
        if (!fs.existsSync("images/xelosani")) {
          fs.mkdirSync("images/xelosani")
        }
        if (!fs.existsSync("images/damkveti")) {
          fs.mkdirSync("images/damkveti")
        }
        dotenv.config()
        app.listen(port, () => {
            console.log(`Listening on port:${port}`)
        })
    } catch(err) {
        console.log(err)
    }
}

start_server()