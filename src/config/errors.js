const authFailed = {
    headerCode: 401,
    subCode: 0x01,
    errorMsg: "Authentication Error"
};

const dbError = {
    headerCode: 500,
    subCode: 0x05,
    errorMsg: "db exception"
};

const paramsInValid = {
    headerCode: 400,
    subCode: 0x01,
    errorMsg: "传入参数错误"
};

function permissionDenied(reason) {
    return {
        headerCode: 403,
        subCode: 0x07,
        errorMsg: reason
    }
}

const userRankWrong = {
    headerCode: 403,
    subCode: 0x08,
    errorMsg: "用户身份错误"
}

module.exports = { authFailed, dbError, paramsInValid, permissionDenied, userRankWrong };