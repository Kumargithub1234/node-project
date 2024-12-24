const express = require('express')

const bcrypt = require('bcryptjs')

const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken')

const cookieParser = require('cookie-parser')

require('dotenv').config();

const app = express()

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true}))

app.use(cookieParser());

app.set("view engine", "ejs")

// import mongoose
const mongoose = require('mongoose')

// connect to the db
mongoose.connect(process.env.MONGO_URI)

// get 
const db = mongoose.connection

db.once('open',()=>{
    console.log('successfully connected to db')
    // console.log(db.collections)
})

// protected route
app.get('/',(req,res)=>{
   const {token} = req.cookies;
   if(token){
    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if(tokenData.type == 'user'){
        res.render('home')
    }
   } else{
    res.redirect('/signin')
   }
})

app.get('/signin',(req,res)=>{
    res.render('signin')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.post('/signup', async (req,res)=>{
    const {name, email, password: plaintextPassword} = req.body;
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = bcrypt.hashSync(plaintextPassword, salt)

    try {
        await user.create({
            name,
            email,
            password: encryptedPassword
        })
        res.redirect('/signin')
    } catch(error){
        console.log(error)
    }
})

app.post('/signin', async (req,res) =>{
    const {email, password} = req.body;
    const userObj = await user.findOne({email})

    if(!userObj){
        res.send({ error: "user doesn't exist" , status:404})
    }

    try{
        if(await bcrypt.compare(password, userObj.password)){
            // creating jwt token
            const token = jwt.sign({
                userId:userObj._id, email: email, type: "user"
            }, process.env.JWT_SECRET_KEY, {expiresIn: '2hr'})
            res.cookie("token", token, {maxAge: 2*60*60*100})
            res.redirect('/')
        }
    } catch(error){
        console.log(error)
    }

   
})

const userRouter = require('./Routes/user')

const user = require('./models/user')

app.use('/users' , userRouter)

app.listen(5000)

console.log('server is listening at port 5000')