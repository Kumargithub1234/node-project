const express = require('express')

const route = express.Router()

const User = require('../models/user');

// get all users data
route.get('/', async (req,res)=>{
    // console.log(req.query)
    // res.json({ message: "All users data"})

    try {
        const usersData = await User.find();
        res.status(200).json({ data : usersData})
    } catch(error){
        res.status(500).json({ message : error.message})
    }
})



//get single user data
route.get('/:id', async (req,res)=>{
    // res.json({ message: "single user data"})

    const user = await User.findById(req.params.id);
    if(user){
        res.status(200).json({ data: user})
    } else{
        res.status(404).json({ message: " User not found"})
    }
})



// create user data
route.post('/new',async (req,res)=>{
    const newUser = new User({ userName: req.body.userName})
    await newUser.save()
    // created user in db
    res.json({ message: "created user"})
})




// update user details
route.put('/update/:id', (req,res)=>{
    console.log(req.params)
    console.log(req.body)
    res.json({ message: "user details updated"})
})

// update user details
route.patch('/update/:id', async (req,res)=>{
    const user = await User.findById(req.params.id)

    user.userName = req.body.userName
    await user.save()
    res.json({ message: "user details updated"})
})


// delete user
route.delete('/delete/:id', async (req,res)=>{
    // res.json({ message: "user deleted"})

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "user is deleted"})

})


module.exports = route