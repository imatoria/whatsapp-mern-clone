import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  name: String,
  photoURL: String,
});

export default mongoose.model("users", userSchema);
