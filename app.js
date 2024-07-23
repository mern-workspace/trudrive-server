const express = require('express') 
const app = express()

const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

const { PORT } = require('./configuration/config')
const connect = require('./database/connection')

const userRouter = require('./routes/userRoute')
const adminRouter = require('./routes/adminRoute')


app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).send({ message: "API running successfully !"})
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)

connect()
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
