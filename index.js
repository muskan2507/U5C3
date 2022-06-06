const express=require("express")
const fs=require("fs")
const app=express();
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// app.get("/",(req,res)=>{
//     res.send("hello")
// })
app.post("/user/create",(req,res)=>{
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const parsed=JSON.parse(data);
        parsed.users=[...parsed.users,req.body]
        fs.writeFile("./db.json",JSON.stringify(parsed),"utf-8",()=>{
            res.status(201).send("user created")
        })
    })
})
app.get("/",(req,res)=>{
    const {id} = req.params;
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        
       res.send(JSON.parse(data))
    })
})
app.listen(8080,()=>{
    console.log("server running at port http://localhost:8080/*")
})