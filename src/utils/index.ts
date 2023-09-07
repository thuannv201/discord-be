function sendFailMessage(
    message: string = "",
    other: any = {},
    status: number | null = null,
    documentName: string = "element"
) {
    switch (status) {
        case null:
            return Object.assign(
                {
                    status: "fail",
                    message: message,
                },
                other
            );
        case 11000:
            return Object.assign(
                {
                    status: "fail",
                    message: message,
                    error: `${documentName} already exist`,
                },
                other
            );
    }
}
function sendSuccessMessage(message: string = "", other: any = {}) {
    return Object.assign(
        {
            status: "success",
            message: message,
        },
        other
    );
}
export { sendFailMessage, sendSuccessMessage };
