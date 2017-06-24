class ResType {
    constructor(msg, success, type) {
        this.success = success != undefined ? success : true;
        this.msg = msg || '';
        this.type = type;
    }
}

module.exports = ResType        // 响应类