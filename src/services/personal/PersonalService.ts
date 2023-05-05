import { Request, Response, NextFunction } from "express";
import User from "../../models/user/userModels";
import UserRequest from "../../models/user/requestUser";
import { sendSuccessMessage, sendFailMessage } from "../../utils";
import UserSpecial from "../../models/user/userSpecial";
import conversation from "../../models/conversations/conversation";
import logger from "../../logger/logger";

class PersonalService {
    /**
     * get personal data
     * @param id : number
     * @returns Response
     */
    async getPersonalData(id: number): Promise<any> {
        try {
            const user = await User.findOne({ _id: id })
                .populate("details")
                .populate("servers")
                .exec();
            return user;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

export default new PersonalService();
