import mongoose from "mongoose";
import bcrypt from "bcryptjs";
var Schema = mongoose.Schema;

var User = new Schema({
  nom: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  famille: {
    type: String
  },
  age: {
    type: String
  },
  nourriture: {
    type: String
  },
  race: {
    type: String
  },
  friends: {
    type: [
      {
        _id: {
          type: String
        }
      }
    ],
    default: []
  }
});
User.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
};

User.methods.isValid = function(hashedpassword) {
  return bcrypt.compareSync(hashedpassword, this.password);
};

module.exports = mongoose.model("User", User);
