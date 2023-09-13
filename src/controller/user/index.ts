import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { sendSuccessMessage, sendFailMessage } from "../../utils";
import conversation from "../../models/conversations/conversation";
import PersonalService from "../../services/personal";

class PersonalController {
    /**
     * get personal data
     * @param req
     * @param res
     * @returns Response
     */
    async getPersonalData(req: Request, res: Response) {
        try {
            if (req?.query?.id) {
                const response = await PersonalService.getPersonalData(
                    req.query.id as string
                );
                return res.send(response);
            } else {
                res.status(201).send(sendFailMessage("id is required"));
            }
        } catch (err) {
            res.status(201).send(sendFailMessage("failed occurred", err));
        }
    }
    getReceivedListRequest(req: Request, res: Response) {
        /*try {
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
    }*/
    }
    getOwnListRequest(req: Request, res: Response) {
        /*try {
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
    }*/
    }

    getListFriend(req: Request, res: Response) {
        /*try {
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
    } catch (e) {}*/
    }

    getListDirectMessage(req: Request, res: Response) {
        conversation
            .find({ recipients: { $in: [req.query.id] } })
            .then((data) => {
                res.send(sendSuccessMessage("find success", { data: data }));
            })
            .catch((err) => {
                res.status(201).send(
                    sendFailMessage("failed occurred!", { err: err })
                );
            });
    }
}

export default new PersonalController();
