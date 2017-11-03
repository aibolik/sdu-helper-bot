function ReplyMessage(sourceMessage, text) {
    this.telegram = {
        method: 'sendMessage',
        parameters: {
            chat_id: sourceMessage.sourceEvent.message.chat.id,
            reply_to_message_id: sourceMessage.sourceEvent.message.message_id,
            text
        }
    }
}

module.exports = {
    ReplyMessage: ReplyMessage
}