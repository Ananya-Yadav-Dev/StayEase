const express = require('express');
const app = express();
const mongoose = require("mongoose");

const mongo_url = "mongodb://localhost:27017/learning";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
   console.log("error:",err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(8080,()=>{
    console.log("Hi i am roo")
});