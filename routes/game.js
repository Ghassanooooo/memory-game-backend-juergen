const express = require("express");
var multer = require("multer");
const uuidv1 = require("uuid/v1");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const router = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");

router.get("/:id", (req, res) => {
  Game.findOne({ user: req.params.id })
    .then(game => {
      if (game) {
        return res.json(game);
      } else {
        return res.json(null);
      }
    })
    .catch(e => {
      console.log(e);
    });
  // Game.findOne({ user: req.params.id }).than(game => {
  //   if (!game) {
  //     return res.json([]);
  //   }
  //   return res.json(game);
  // });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir("./uploads/game/" + req.params.id, function(e) {
      if (!e || (e && e.code === "EEXIST")) {
        cb(null, "./uploads/game/" + req.params.id);
      }
    });
  },

  filename: (req, file, cb) => {
    cb(null, uuidv1() + "-" + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/svg"
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

router.post("/game-data/:id/:gamesize", upload.array("gameImgs"), (req, res) => {
console.log(req.params);
console.log(req.files);

  if (req.files && req.files.length == req.params.gamesize) {
    Game.findOne({ user: req.params.id }).then(game => {
      if (game) {
        const imgsUrl = [];
        req.files.map(Url => {
          imgsUrl.push({
            cardName: `${Url.filename}`,
        //    img: `https://memory-game-7.herokuapp.com/uploads/game/${
            img: `http://localhost:5000/uploads/game/${
              req.params.id
            }/${Url.filename}`
          });
        });
        if (imgsUrl.length == req.params.gamesize) {
          game.imgsGame = imgsUrl;
          game.gamesize = req.params.gamesize;
          game.save();
        return  res.json(game);
          console.log('data from DB change',game)
        }
      } else {
        const imgsUrl = [];
        req.files.map(Url => {
        // imgsUrl.push(`http://localhost:5000/uploads/game/${Url.filename}`)
          imgsUrl.push({
            cardName: `${Url.filename}`,
          //  img: `https://memory-game-7.herokuapp.com/uploads/game/${
             img: `http://localhost:5000/uploads/game/${req.params.id}/${Url.filename}`
          });
        });
      console.log('imgs url fixed',imgsUrl);
        if (imgsUrl.length == req.params.gamesize) {


          return new Game({
            user: req.params.id,
            gamesize: req.params.gamesize,
            imgsGame: imgsUrl
          }).save((err, data) => {
            return res.json(data);
            console.log('data from DB',data)
          });
        }
      }
    });
  }
});

module.exports = router;
