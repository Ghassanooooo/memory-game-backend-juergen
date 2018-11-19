const express = require("express");
const mongoose = require("mongoose");


const keys = require("./config/keys");


const app = express();

mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongodb connected!!"))
  .catch(err => {
    throw new Error(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization ,Origin, X-Requested-With, Accept, X-Custom-Header"
  );
  next();
});

app.get('/',(req,res)=>{
  res.json({msg:'Hallo team :)'})
})



// all errors handle middleware
app.use((error, req, res, next) => {
  return res.status(error.httpStateCode).json(error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`start with port ${PORT}`);
});