const { v4: uuidv4 } = require("uuid");
const express=require("express")
const fs=require("fs")
const app=express();
const { validate, ValidationError, Joi } = require('express-validation');

app.use(express.urlencoded({extended:true}))
app.use(express.json())
const loggerValidation = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
  }

app.get("/",(req,res)=>{
    res.send("hello")
})
app.post("/user/create",(req,res)=>{
    let c=0;
    const id=c++
    req.body = {...req.body,id}

    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const parsed=JSON.parse(data);
        console.log(req.body)
        let d=  JSON.parse(data).users
        d.map((e)=>{
            if(e.name !== req.body.name){
                parsed.users=[...parsed.users,req.body]
                fs.writeFile("./db.json",JSON.stringify(parsed),"utf-8",()=>{
                    res.status(201).send("user created")
                })
            }
        })
       
    })
})
app.get("/user/:id",(req,res)=>{
    const {id} = req.params;
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
            

     let d=  JSON.parse(data).users
    // console.log(d)
    d.map((e)=>{
        console.log(e)
        if(e.id==id){
            res.send(e)
        }   
    
    })
    })
})
app.post("/user/login",validate(loggerValidation, {}, {}),(req,res)=>{
    
    const token = uuidv4();
    fs.readFile("./db.json","utf-8",(err,data)=>{
        const parsed = JSON.parse(data);
        parsed.users.map((el)=>{
            if(el.username==req.body.username && el.password==req.body.password){
                el.token=token;
            }
        })
        parsed.users = [...parsed.users];

        fs.writeFile("./db.json",JSON.stringify(parsed),{encoding:"utf-8"},()=>{
            res.status(201).send("Login successfull");
        })
    })
})

app.post("/user/logout",(req,res)=>{
    fs.readFile("./db.json","utf-8",(err,data)=>{
        const parsed = JSON.parse(data);
        parsed.users.map((el)=>{
            if(el.username==req.body.username && el.password==req.body.password){
                el.token="";
            }
        })
        parsed.users = [...parsed.users];

        fs.writeFile("./db.json",JSON.stringify(parsed),{encoding:"utf-8"},()=>{
            res.status(200).send("user logged out successfully");
        })
    })
}) 
app.listen(8080,()=>{
    console.log("server running at port http://localhost:8080/*")
})