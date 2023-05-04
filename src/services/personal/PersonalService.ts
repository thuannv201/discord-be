import { Request, Response, NextFunction } from "express";
import User from "../../models/user/userModels";
import UserRequest from "../../models/user/requestUser";
import { sendSuccessMessage, sendFailMessage } from "../../utils";
import UserSpecial from "../../models/user/userSpecial";
import conversation from "../../models/conversations/conversation";

class PersonalService {
    /**
     * get personal data
     * @param id : number
     * @returns Response
     */
    getPersonalData(id: number): Response {
        let response: Response<any, any>;
        try {
            if (id) {
                const user = User.findOne({
                    _id: id,
                })
                    .populate("details")
                    .populate("servers");
            } else {
                
            }
        } catch (err) {
            
        }
        return response<{}>();
    }

}
