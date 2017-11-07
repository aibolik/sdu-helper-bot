function Message(sourceMessage, text, parse_mode = null) {
    this.telegram = {
        method: 'sendMessage',
        parameters: {
            chat_id: sourceMessage.sourceEvent.message.chat.id,
            text,
            parse_mode
        }
    }
}

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

function ChannelMessage(channelName, text, parse_mode = null) {
    this.telegram = {
        method: 'sendMessage',
        parameters: {
            chat_id: channelName,
            text,
            parse_mode
        }
    }
}

module.exports = {
    ReplyMessage: ReplyMessage,
    Message: Message,
    ChannelMessage: ChannelMessage
}