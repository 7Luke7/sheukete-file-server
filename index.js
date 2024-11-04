const express = require("express")
const cors = require("cors")
const port = 5555
const router = require("./routes/router")
const fs = require('node:fs');
const dotenv = require("dotenv")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(router)

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