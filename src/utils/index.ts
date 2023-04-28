function sendFailMessage(message: string = "", other: object = {}, status: number | null = null, documentName: string = "element") {
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
          error:`${documentName} already exist`
        },
        other
      );
  }
}
function sendSuccessMessage(message: string = "", other: object = {}) {
  return Object.assign(
    {
      status: "success",
      message: message,
    },
    other
  );
}
module.exports = { sendFailMessage, sendSuccessMessage };
