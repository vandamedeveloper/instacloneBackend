const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seguidoresSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seguidor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Seguidores = mongoose.model("Seguidores", seguidoresSchema);

module.exports = Seguidores;
