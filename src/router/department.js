const { verifyToken } = require("../middlewares/authHandler");
const errors = require("../config/errors");
const { query } = require('../db/db')

function init(router) {
    router.get("/departments", verifyToken, getDepartments);
    router.post("/department/add", verifyToken, addDepartment);
    router.post("/departments/delete", verifyToken, deleteDepartments);
    router.post("/department/update", verifyToken, updateDepartment);
}

async function addDepartment(ctx, next) {
    const postData = ctx.request.body;
    let result = await query('select * from department where code= ? or name= ?;', [postData.code, postData.name]);
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "部门编号或部门名称与已有部门信息重复，请确认！"
        }
    }
    await query('INSERT INTO department SET ?', postData);

    ctx.body = {
        code: 200,
        data: [],
        message: 'add success'
    };
}

async function getDepartments(ctx, next) {

    let result = await query('SELECT * FROM department;');
    let list = [];
    result.forEach((department) => {
        list.push({
            id: department.id,
            code: department.code,
            name: department.name,
            description: department.description
        })
    });

    ctx.body = {
        code: 200,
        data: list,
        message: 'ok'
    };
}

async function deleteDepartments(ctx, next) {
    const postData = ctx.request.body;

    let ids = "";
    for (let id of postData.ids) {
        ids += parseInt(id) + ',';
    }

    if (ids.endsWith(',')) {
        ids = ids.substring(0, ids.length - 1);
    }

    let result = await query('select * from employee where departmentId in (' + ids + ')');
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "部门信息在使用中，无法删除，请确认！"
        }
    }

    if (ids != "") {
        await query('DELETE FROM department where id in (' + ids + ')');
    }

    ctx.body = {
        code: 200,
        data: [],
        message: 'delete success'
    }
}

async function updateDepartment(ctx, next) {
    const postData = ctx.request.body;

    let result = await query('select * from department where (code= ? or name= ?) and id!=?;', [postData.code, postData.name, postData.id]);
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "已存在相同编号或名称的部门，请确认！"
        }
    }

    await query(`UPDATE department SET code=?, name = ?, description = ?  WHERE id = ?;`,
        [postData.code, postData.name, postData.description, postData.id]);

    ctx.body = {
        code: 200,
        data: [],
        message: 'update success'
    }
}

module.exports = { init };
