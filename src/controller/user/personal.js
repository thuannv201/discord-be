const UserModel = require("../../models/user/userModels");
const UserRequest = require("../../models/user/requestUser");
const {sendSuccessMessage, sendFailMessage} = require("../../utils");
const UserSpecial = require("../../models/user/userSpecial");
const conversation = require("../../models/conversations/conversation");

class PersonalController {
  getPersonalData(req, res) {
    try {
      if (req?.query?.id) {
        console.log("req?.query?.id :", req?.query?.id);
        UserModel.findOne({_id: req.query.id})
          .populate("details")
          .populate("servers")
          .exec((err, data) => {
            console.log("err :", err);
            if (err) {
              res.status(201).send(sendFailMessage("fail", {err: err}));
            }
            if (data) {
              res.send(sendSuccessMessage("Success", {personal: data}));
            }
          });
      } else {
        res.status(201).send(sendFailMessage("id is required"));
      }
    } catch (err) {
      res.status(201).send(sendFailMessage("failed occurred", err));
    }
  }
  getReceivedListRequest(req, res) {
    try {
      if (req?.query?.id) {
        UserRequest.find({to: req.query.id})
          .populate("requestor")
          .exec((err, data) => {
            if (err) {
              res.send(sendFailMessage("fail", {err: err}));
            }
            if (data) {
              res.send(sendSuccessMessage("Success", {request: data}));
            }
          });
      } else {
        res.status(201).send(sendFailMessage("id is required"));
      }
    } catch (e) {
      res.status(201).send(sendFailMessage("failed occurred", err));
    }
  }
  getOwnListRequest(req, res) {
    try {
      if (req?.query?.id) {
        UserRequest.find({requestor: req.query.id})
          .populate("to")
          .exec((err, data) => {
            if (err) {
              res.send(sendFailMessage("fail", {err: err}));
            }
            if (data) {
              res.send(sendSuccessMessage("Success", {request: data}));
            }
          });
      } else {
        res.status(201).send(sendFailMessage("id is required"));
      }
    } catch (e) {
      res.status(201).send(sendFailMessage("failed occurred", err));
    }
  }

  getListFriend(req, res) {
    try {
      UserSpecial.find({id: req.query.id})
        .populate({
          path: "specialList",
          populate: {
            path: "id",
            model: "Users",
          },
        })
        .exec((err, data) => {
          if (data) {
            res.send(sendSuccessMessage("find success", {data: data}));
          }
          if (err) {
            res
              .status(201)
              .send(sendSuccessMessage("find success", {err: err}));
          }
        });
    } catch (e) {}
  }

  getListDirectMessage(req, res) {
    conversation
      .find({recipients: {$in: [req.query.id]}})
      .then((data) => {
        res.send(sendSuccessMessage("find success", {data: data}));
      })
      .catch((err) => {
        res.status(201).send(sendFailMessage("failed occurred!", {err: err}));
      });
  }
}

module.exports = new PersonalController();
