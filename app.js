const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors({
    origin:"https://kmitron-achievements.netlify.app"
}));



async function run(){
    await mongoose.connect("mongodb+srv://achievements:Qwerty123@cluster0.m4nqqfa.mongodb.net/achievements?retryWrites=true&w=majority",(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected DB");
    }
});
}

run();

let sc = new mongoose.Schema({username:{type:String,required:true},
    branch:{type:String,required:true},
    photo:{type:String,required:true},
    github:{type:String,required:true},
    achievements: {type: Array},
  })

let authSchema = new mongoose.Schema({username:{type:String, required: true,unique: true},password:{type:String, required: true},branch:{type:String, required: true},photo:{type:String, required: true},github:{type:String, required: true}});

let mod = new mongoose.model('Articles', sc);
let authMod = new mongoose.model('auths',authSchema);

app.use(express.json());
var studBranch = "";
var studPhoto = "";
app.post('/register',(req,res)=>{
    var registration = new authMod({
        username: req.body.username,
        password: req.body.password,
        branch: req.body.branch,
        photo: req.body.photo,
        github: req.body.github
    })
    registration.save((err,data)=>{
        if(err){
            res.send("Could not register");
            console.log(err);
        }
        else{
            console.log("User registered!");
            res.send("Registered successfully");
        }
    })
})


app.post('/login', async (req,res)=>{
    // try{
    //     var username = "Vijay";
    //     var password = "Qwerty123";
    //     var data = mongoose.model('auths',authSchema);
    //     // var check = data.find({username});
    //     // if(!check){
    //     //     res.send("User not registered!");
    //     //     throw new Error('user not found')
    //     // }
    //     // else{
    //     //     res.send(check.json());
    //     //     console.log(check.json());
    //     //     }

    //     authMod.find({username}).then(data =>{
    //         console.log(data);
    //         res.send("Found!");
    //     })
    // }
    // catch(err){
    //     console.log(err);
    //     res.send('no user')
    // }

    var username = req.body.username;
    var password = req.body.password;

    // console.log(username);

    authMod.findOne({username})
    .then(data =>{
        console.log(data);
        if(data){
            if(data.password === password){
                res.status(200);
                res.send("Bruh");
                console.log("Logged in!")
            }
            else{
                res.status(201);
                res.send("Wrong password");
            }
        }
        else{
            res.status(202);
            res.send("User not found!");
        }
    })

})

app.post('/userinfo', (req,res)=>{
    authMod.find({username:req.body.username},(err,data)=>{
        if(err){
            console.log("Unable to fetch data");
        }
        else{
            console.log("Found: " + data);
            res.send(JSON.stringify(data));
        }
    })
})

app.post('/send', async(req,res) => {
    console.log("SENT");
    var input = new mod({
        username: req.body.username,
        branch: req.body.branch,
        photo:req.body.photo,
        github: req.body.github,
        achievements: req.body.achievements
    })


    mod.findOne({username:req.body.username}, async function(err,data){
        if(data===null){
            console.log("IDK");
            input.save((err1,data)=>{
                if(err1){
                    //{} console.log(err);
                    // return res.status(201).json({error:"Error ochindi"})
                    res.send("Error");
                }
                else{
                    console.log("Data added");
                    return res.send("Success!");
                }
            })
        }
        else{
            console.log(data);
            await mod.update({username:req.body.username},{ $push: { "achievements": req.body.achievements }}, { new: true } );
        }
    })

    
})

app.get('/getData',(req,res)=>{
    console.log("Called");

    let data = mongoose.model('Articles',sc);
    data.find((err,data)=>{
        if(err){
            console.log("Unable to fetch data");
        }
        else{
            // console.log(data);
            res.send(JSON.stringify(data));
        }
    })
})



app.listen(3002,()=>{
    console.log("Listening at 3002");
})

module.exports = app;

