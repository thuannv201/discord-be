const UserModel = require("../../models/user/userModels");
const ServerModel = require("../../models/servers/server");
const { sendSuccessMessage, sendFailMessage } = require("../../utils");

class PersonalController {
  getPersonalData(req, res) {
    try {
      if (req?.query?.id) {
        UserModel.findOne({ _id: req.query.id })
          .populate("details")
          .populate("servers")
          .exec((err, data) => {
            if (err) {
              res.send(sendFailMessage("fail", { err: err }));
            }
            if (data) {
              res.send(sendSuccessMessage("Success", { personal: data }));
            }
          });
      }
      else{
        res.send(sendFailMessage("id is required"));
      }
    } catch (err) {
      res.status(201).send(sendFailMessage("failed occurred", err));
    }
  }
}

module.exports = new PersonalController();
