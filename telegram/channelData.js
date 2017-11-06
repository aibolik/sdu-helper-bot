function ReplyMessage(sourceMessage, text, parse_mode = null) {
    this.telegram = {
        method: 'sendMessage',
        parameters: {
            chat_id: sourceMessage.sourceEvent.message.chat.id,
            reply_to_message_id: sourceMessage.sourceEvent.message.message_id,
            text,
            parse_mode
        }
    }
}

module.exports = {
    ReplyMessage: ReplyMessage
}