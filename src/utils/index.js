function sendFailMessage(message = "", other = {}, status = null,documentName="element") {
console.log('status :', status);
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
function sendSuccessMessage(message = "", other = {}) {
  return Object.assign(
    {
      status: "success",
      message: message,
    },
    other
  );
}
module.exports = { sendFailMessage, sendSuccessMessage };
