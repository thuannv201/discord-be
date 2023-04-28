const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Servers = new Schema(
  {
    members: [{type: Schema.Types.ObjectId,ref:"Users"}],
    cover_image:{type:String,default:""},
    description:{type:String,default:""},
    icon:{type:String,default:""},
    name:{type:String,default:""},
    publishers:[{ type: Schema.Types.ObjectId,ref:"Users"}],
    rooms:[{type: Schema.Types.ObjectId}],
  },
  {timestamp: true}
);

module.exports = mongoose.model("Servers", Servers, "Servers");
