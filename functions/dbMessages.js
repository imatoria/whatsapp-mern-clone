import mongoose from "mongoose";

const messagesSchema = mongoose.Schema({
  byUserId: String,
  toUserId: String,
  message: String,
  timestamp: String,
});

export default mongoose.model("messagecontents", messagesSchema);
