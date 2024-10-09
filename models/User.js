const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    required: [true, "name value must be provided"],
    type: String,
    maxLength: 30,
  },
  email: {
    required: [true, "email value must be provided"],
    type: String,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Not a valid email",
    },
  },
  password: {
    required: [true, "password value must be provided"],
    type: String,
    maxLength: 70,
    minLength: 4,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.modifiedPaths().includes("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

module.exports = mongoose.model("User", UserSchema);
