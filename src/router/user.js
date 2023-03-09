const { verifyToken, checkAdminPermission } = require("../middlewares/authHandler");
const _ = require("lodash");
const errors = require("../config/errors");
const jwt = require("jsonwebtoken");
const { query } = require('../db/db')

function init(router) {
    router.post("/login", login);
    router.post("/user/add", verifyToken, checkAdminPermission, addUser);
    router.post("/user/update", verifyToken, checkAdminPermission, updateUser);
    router.post("/user/resetPassword", verifyToken, checkAdminPermission, resetPassword);
    router.get("/users", verifyToken, checkAdminPermission, getUsers);
    router.post("/user/delete", verifyToken, checkAdminPermission, deleteUsers);
}

async function addUser(ctx, next) {
    const postData = ctx.request.body;
    let result = await query('select * from user where userName= ?;', [postData.userName]);
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "用户名已存在，请确认！"
        }
    }
    await query('INSERT INTO user SET permission=0,   ?', postData);
    ctx.body = {
        code: 200,
        data: [],
        message: 'add success'
    };
}

async function getUsers(ctx, next) {
    let result = await query('SELECT * FROM user;');
    let list = [];
    result.forEach((item) => {
        list.push({
            id: item.id,
            userName: item.userName,
            permission: item.permission,
            remark: item.remark
        })
    });

    ctx.body = {
        code: 200,
        data: list,
        message: 'ok'
    };
}

async function updateUser(ctx, next) {
    const postData = ctx.request.body;

    let result = await query('select * from user where userName= ? and id != ?;', [postData.userName, postData.id]);
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "用户名与其他用户重复，请确认！"
        }
    }

    await query(`UPDATE user SET  userName = ? ,remark= ?  WHERE id = ?;`,
        [postData.userName, postData.remark, postData.id]);

    ctx.body = {
        code: 200,
        data: [],
        message: 'update success'
    }
}

async function resetPassword(ctx, next) {
    const postData = ctx.request.body;

    await query(`UPDATE user SET  password = ?  WHERE id = ?;`,
        [postData.password, postData.id]);

    ctx.body = {
        code: 200,
        data: [],
        message: 'update success'
    }
}

async function deleteUsers(ctx, next) {
    const postData = ctx.request.body;

    let ids = "";
    for (let id of postData.ids) {
        ids += parseInt(id) + ',';
    }

    if (ids.endsWith(',')) {
        ids = ids.substring(0, ids.length - 1);
    }

    console.log(ids);
    if (ids != "") {
        await query('DELETE FROM user where id in (' + ids + ') and permission != 1');
    }

    ctx.body = {
        code: 200,
        data: [],
        message: 'delete success'
    }
}

async function login(ctx, next) {
    const postData = ctx.request.body;
    let result = await query(`SELECT * FROM user where userName= '${postData.userName}' and  password= '${postData.password}' ;`);
    if (_.isEmpty(result)) {
        ctx.throw(401, '用户名或密码错误！');
        throw errors.authFailed
    }
    const user = result[0];
    let userToken = {
        name: postData.userName,
        id: user.id,
        permission: user.permission
    };
    let token = await createToken(userToken);
    // 签发token
    ctx.body = {
        id: user.id,
        login_name: user.userName,
        token: token,
        phone: user.phoneNumber,
        permission: Number(user.permission)
    };
}

async function createToken(userToken) {
    let token = jwt.sign(userToken, process.env.SECRET_KEY, {
        "expiresIn": process.env.TOKEN_EXPIRE_TIME
    });
    return token;
}

module.exports = { init };
