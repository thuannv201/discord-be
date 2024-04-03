import { BaseService } from "@services/common";
import { Request, Response } from "express";
import FriendApi from "@api/friend";

class FriendService extends BaseService {
    async execute(req: Request, res: Response) {
        try {
            const user = await FriendApi.findUsers();
            console.log(user);
            this.ok(res, user);
        } catch (err: any) {
            console.log("err :", err);
            this.fail(res, err);
        }
    }
}

export default new FriendService();
