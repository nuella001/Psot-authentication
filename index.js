const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors')
const app = express();

app.use(
    cors({
        origin:"*"
    })
)
app.use(express.json());
const PORT = process.env.PORT || 5008;

mongoose
    .connect("mongodb+srv://Chioma:737373emmanuella@psot-backend.bggvhhd.mongodb.net/Books",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => {
        console.log('connected to db!')
    })
    .catch((err) => console.log('An error occured', err));

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model('User', userSchema);
//   let user = new UserModel({
//     name:'Chioma',
//     email:'chiomamemmanuella@gmail.com',
//     password:'ella',
//   })
//   user.save();

//   Sign up authorization
app.get('/', (req,res)=>{
    res.send('Hello world')
})

app.post('/api/users', async (req, res) => {
    try {
        let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let newuser = new UserModel(
        {
            name,
            email,
            password
        }
    )

    let newcustomer = await newuser.save();
    res.status(200).json({
        name: newcustomer.name,
        email: newcustomer.email
    });
    } catch (error) {
        res.status(400).send(error)
    }
    

})

// Login authorization
app.post('/api/users/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password

    let user = await UserModel.findOne({ email: email });

    if (!user) { res.status(404).send('user not found, sign up!') }

    if (user.email == email && user.password == password) {
        res.status(200).send({
            name: user.name,
            email: user.email
        });
    }

    else {
        res.status(401).send('Invalid username or password')
    }

})

app.listen(PORT, () => {
    console.log("Listening on 5008");
});
