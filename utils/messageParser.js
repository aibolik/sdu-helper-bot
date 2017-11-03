function hasHashtags(text, hashtags) {
    if (Array.isArray(hashtags)) {
        for (let tag of hashtags) {
            if (text.indexOf(tag) >= 0) return true;
        }
        return false;
    } else {
        return text.indexOf(hashtags) >= 0;
    }
}

function log(message) {
    console.log(JSON.stringify(message));
}

exports.log = log;
exports.hasHashtags = hasHashtags;