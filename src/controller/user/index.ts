import { Request, Response } from "express";
import { sendFailMessage } from "@utils/index";
import PersonalService from "@services/personal";

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
}

export default new PersonalController();
