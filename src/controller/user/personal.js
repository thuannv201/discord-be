const UserModel = require("../../models/user/userModels");
const UserRequest = require("../../models/user/requestUser");
const {sendSuccessMessage, sendFailMessage} = require("../../utils");

class PersonalController {
  getPersonalData(req, res) {
    try {
      if (req?.query?.id) {
        UserModel.findOne({_id: req.query.id})
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

  getListSpecialUsers(req, res) {
    try {
    } catch (e) {}
  }

  // acceptRequest(req, res) {
  //   try {
  //     UserSpecial.findOne({owner:req?.query?.owner}).then(data=>{
  //       if(data){
  //         UserSpecial.updateOne({owner:req?.query?.owner},{$push:{specialList:{role:"friend",}}})
  //       }
  //     })
  //   } catch (e) {
  //     res.status(201).send(sendFailMessage("failed occurred", err));
  //   }
  // }
}

module.exports = new PersonalController();

// try {

// } catch (e) {
//   res.status(201).send(sendFailMessage("failed occurred", err));
// }
