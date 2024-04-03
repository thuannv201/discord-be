import { Request, Response } from "express";
import FriendService from "@services/friend";
export const getFriends = async (req: Request, res: Response) => {
    await FriendService.execute(req, res);
};
