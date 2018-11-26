const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required:true
      },
    imgsGame:{
        type:[String],
        required:true
    },
    date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Game = mongoose.model("game", GameSchema);
