import mongoose from "mongoose";

mongoose.connect("mongodb+srv://m9857395:MYIxb5K86UZlCvbp@cluster0.4tlxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error", err));

const messageSchema = new mongoose.Schema({
  room: String,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);
