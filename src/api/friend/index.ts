import UserInfo from "@models/users/UserInfo";

class FriendApis {
    async findUsers() {
        const data = await UserInfo.find({});
        return data;
    }
}

export default new FriendApis();
