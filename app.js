const express = require('express') 
const app = express()

const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

const { PORT } = require('./configuration/config')
const connect = require('./database/connection')

const userRouter = require('./routes/userRoute')
const adminRouter = require('./routes/adminRoute')
const directoryRouter = require('./routes/directoryRoute')
const fileRouter = require('./routes/fileRoute')
const { connectToRedis } = require('./cache/connection')


app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
))
app.use(morgan('tiny'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).send({ message: "API running successfully !"})
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/folders', directoryRouter)
app.use('/api/v1/files', fileRouter)

connect()
    .then(() => {
        try{
            connectToRedis()
        } 
        catch(error) {
            console.log(`Can't Connect to Redis : ${error}`)
        }
    })
    .then(() => {
        try{
            app.listen(PORT, console.log(`Server is running at http://localhost:${PORT}`))
        }
        catch(error) {
            console.log(`Can't connect to DB : ${error}`)
        }
    })
    .catch((error) => {
        console.log(`Error while connecting to database : ${error}`)
    })
