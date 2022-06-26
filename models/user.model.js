const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
      fName : {type: String},
      lName : {type: String},
      username : {type: String},
      email: { type: String},
      phone: { type: Number },
      password: { type: String},
      address:[{
        uuid: {type: String},
        name : {type: String},
        phone : {type: String},
        address1:{type: String},
        address2:{type: String},
        pincode:{type: String}
      }],
      oldPasswords : {type:Array}
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
  
  module.exports = mongoose.model("user", UserSchema);
  
