const UserModel = require("../../models/user/userModels");
const ServerModel = require("../../models/servers/server");
const { sendSuccessMessage } = require("../../utils");

class PersonalController {
  getPersonalData(req, res) {
    UserModel.findOne({ _id: req.params?.id })
      .populate("details")
      .exec((err, data) => {
        if (data) {
          res.send(sendSuccessMessage("Success", { personal: data }));
        }
      });
  }
}

module.exports = new PersonalController();
