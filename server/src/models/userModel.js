import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  role: {
    type: String,
    required: true,
    enum: ["employee", "manager", "admin"],
  },
  branch: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: function () {
        return this.role === "manager" || this.role === "employee";
      },
    },
  ],

  jobTitle: {
    type: String,
    enum: ["waiter", "barista", "chef"],
    required: function () {
      return this.role === "employee";
    },
  },
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userschema);
