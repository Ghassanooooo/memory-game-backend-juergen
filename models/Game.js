const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  gamesize: {
    type: String,
    required: true
  },
  imgsGame: [
    {
      cardName: {
        type: String,
        required: true
      },
      img: {
        type: String,
        required: true
      },
      flipped: {
        type: Boolean,
        default: false
      },
      matched: {
        type: Boolean,
        default: false
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Game = mongoose.model("game", GameSchema);
