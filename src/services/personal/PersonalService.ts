import { Request, Response, NextFunction } from "express";
import User from "../../models/users/UserCredential";
import { sendSuccessMessage, sendFailMessage } from "../../utils";
import conversation from "../../models/conversations/conversation";
import logger from "../../logger";

class PersonalService {
    /**
     * get personal data
     * @param id : number
     * @returns Response
     */
    async getPersonalData(id: string): Promise<any> {
        try {
            const user = await User.findOne({ _id: id })
                .populate("details")
                // .populate("Servers")
                .exec();
            return user;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

export default new PersonalService();
