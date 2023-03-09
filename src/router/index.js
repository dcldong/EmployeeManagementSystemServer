const user = require("./user");
const department = require("./department");
const employee = require("./employee");
const Router = require("koa-router");

let router = new Router({ prefix: "/api/v1" });

function initRouteConfig(app) {
    router.get("/test", (ctx, next) => { ctx.body = { msg: "ok" } });
    user.init(router);
    employee.init(router);
    department.init(router);
    app.use(router.routes()).use(router.allowedMethods());
}

module.exports = initRouteConfig;