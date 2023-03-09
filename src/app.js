const Koa = require('koa');
const cors = require("koa2-cors");
const { koaBody } = require("koa-body");
const initRouteConfig = require("./router/index");
const { errorHandle } = require("./middlewares/errorHandler");

const dotenv = require("dotenv")
dotenv.config()

const app = new Koa();
errorHandle(app);
app.use(cors());
app.use(koaBody());
initRouteConfig(app);
app.listen(process.env.PORT, "0.0.0.0");
console.log("the server is listen on port: " + process.env.PORT);
