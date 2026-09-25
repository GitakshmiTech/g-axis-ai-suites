const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'G-Axis API is running',
    })
})

module.exports = app