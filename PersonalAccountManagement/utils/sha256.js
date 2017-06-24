const crypto = require('crypto');
module.exports = function(o) {
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
                    .update(o)
                    .digest('hex');
    return hash;
}