interface ServerToClientEvents {
    noArg: () => void;
    chat_message: (
        content: string,
        attachments: any,
        conversationId: string | string[],
        authorId: number
    ) => void;
    receive_request_friend: (requestor: any) => void;
    request_accepted: () => void;
}

interface ClientToServerEvents {
    chat_message: (
        content: string,
        attachments: any,
        conversationId: string | string[],
        authorId: number
    ) => void;
    join_conversation: (conversationId: string) => void;
    receive_request_friend: (requestor: any) => void;
    send_request_friend: (requestor: any, to: any) => void;
    accept_request_user: (requestor: any, to: any) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

export {
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
};
