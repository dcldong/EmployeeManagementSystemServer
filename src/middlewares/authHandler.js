const _ = require("lodash");
const jwt = require("jsonwebtoken");
const errors = require("../config/errors");

async function verifyToken(ctx, next) {
    if (_.isEmpty(ctx.header.authorization))
        ctx.throw(401, '未登录');

    try {
        let token = ctx.header.authorization.substring(7);
        const info = jwt.verify(token, process.env.SECRET_KEY);
        ctx.userInfo = info;
    } catch (err) {
        ctx.throw(401, err.message)
    }
    return next();
}

async function checkAdminPermission(ctx, next) {
    if (ctx.userInfo.permission != 1) {
        throw errors.authFailed
    }
    return next();
}
module.exports = { verifyToken, checkAdminPermission };

