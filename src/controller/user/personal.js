const UserModel = require("../../models/user/userModels");
const ServerModel = require("../../models/servers/server");
const {sendSuccessMessage} = require("../../utils");

class PersonalController {
  getPersonalData(req, res) {
    UserModel.findOne({_id: "62cf93bec319d67226d3e370"})
      .populate("details")
      .populate("servers")
      .exec((err, data) => {
        if (err) {
          res.send(sendFailMessage("fail", {err: err}));
        }
        if (data) {
          res.send(sendSuccessMessage("Success", {personal: data}));
        }
      });
  }
}

module.exports = new PersonalController();
