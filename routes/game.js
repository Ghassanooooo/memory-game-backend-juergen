const express = require("express");
var multer = require("multer");
const uuidv1 = require("uuid/v1");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const User = require("../models/User");
const Game =require('../models/Game')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/game");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv1() + "-" + file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  const upload = multer({
    storage,
    fileFilter
  });



router.post("/game-data/:id",upload.array('gameImgs',5), (req, res) => {
if(req.files && req.files.length === 5){
   // res.json(req.files)
    const imgsUrl=[]
    req.files.map(Url=>{
        imgsUrl.push(`http://localhost:5000/uploads/game/${Url.filename}`)
    })
    if(imgsUrl.length === 5){
      return  res.json(imgsUrl)   
    }
}



 });

module.exports = router;