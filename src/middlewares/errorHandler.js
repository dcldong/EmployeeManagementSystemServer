async function errorHandle(app) {
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            if (error.name == "UnauthorizedError") {
                error.errorMsg = "Authentication Error";
                error.headerCode = 401;
            }
            let status = error.headerCode || 500;
            let msg = error.errorMsg || "服务器错误";
            let subCode = error.subCode || 0x01;
            ctx.status = status;
            ctx.body = { errorMsg: msg, subCode: subCode };
        }
    });
}

module.exports = { errorHandle };