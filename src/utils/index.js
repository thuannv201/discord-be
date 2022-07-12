function sendFailMessage(message="", other={}){
    return Object.assign({
        status:"fail",
        message:message
    },other)
}
function sendSuccessMessage(message="", other={}){
    return Object.assign({
        status:"success",
        message:message
    },other)
}
module.exports = {sendFailMessage, sendSuccessMessage}