const { verifyToken } = require("../middlewares/authHandler");
const { query } = require('../db/db')

function init(router) {
    router.post("/employees", verifyToken, getEmployees);
    router.post("/employees/totalNumber", verifyToken, getEmployeesTotalNumber);
    router.post("/employee/add", verifyToken, addEmployee);
    router.post("/employees/delete", verifyToken, deleteEmployees);
    router.post("/employee/update", verifyToken, updateEmployee);
}

async function addEmployee(ctx, next) {
    const postData = ctx.request.body;
    let result = await query('select * from employee where code= ? or name= ? or idNumber=? or phoneNumber=?;',
        [postData.code, postData.name, postData.idNumber, postData.phoneNumber]);
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "员工编号、姓名、身份证或手机号信息，与其他员工的信息重复，请确认！！"
        }
    }

    await query('INSERT INTO employee SET ?', postData);

    ctx.body = {
        code: 200,
        data: [],
        message: 'add success'
    };
}


async function getEmployeesTotalNumber(ctx, next) {
    const postData = ctx.request.body;

    let sql = 'SELECT count(*) as totalNumber FROM employee left join department on employee.departmentId=department.id where 1=1 ';
    if (postData.code) {
        sql += `and employee.code like '%${postData.code}%'`;
    }
    if (postData.name) {
        sql += `and employee.name like '%${postData.name}%'`;
    }

    let result = await query(sql);

    ctx.body = {
        code: 200,
        data: result[0] ?? 0,
        message: 'ok'
    };
}


async function getEmployees(ctx, next) {
    const postData = ctx.request.body;
    const pageIndex = postData.current - 1;
    const pageSize = postData.pageSize;
    let sql = 'SELECT employee.*,department.name as departmentName FROM employee left join department on employee.departmentId=department.id where 1=1 ';
    if (postData.code) {
        sql += `and employee.code like '%${postData.code}%'`;
    }
    if (postData.name) {
        sql += `and employee.name like '%${postData.name}%'`;
    }
    sql += `limit ${pageSize} offset ${pageIndex * pageSize} `;
    let result = await query(sql);
    let list = [];
    result.forEach((item) => {
        list.push({
            id: item.id,
            code: item.code,
            name: item.name,
            sex: item.sex,
            departmentId: item.departmentId,
            departmentName: item.departmentName,
            position: item.position,
            entryTime: item.entryTime,
            birthday: item.birthday,
            idNumber: item.idNumber,
            phoneNumber: item.phoneNumber,
            address: item.address,
            remark: item.remark,
        })
    });

    ctx.body = {
        code: 200,
        data: list,
        message: 'ok'
    };
}


async function deleteEmployees(ctx, next) {
    const postData = ctx.request.body;

    console.log(postData);
    let ids = "";
    for (let id of postData.ids) {
        ids += parseInt(id) + ',';
    }

    if (ids.endsWith(',')) {
        ids = ids.substring(0, ids.length - 1);
    }

    console.log(ids);
    if (ids != "") {
        await query('DELETE FROM employee where id in (' + ids + ')');
    }

    ctx.body = {
        code: 200,
        data: [],
        message: 'delete success'
    }
}

async function updateEmployee(ctx, next) {
    const postData = ctx.request.body;

    let result = await query('select * from employee where (code= ? or name= ? or idNumber=? or phoneNumber=? ) and id != ?;',
        [postData.code, postData.name, postData.idNumber, postData.phoneNumber, postData.id]);
    if (result && result.length > 0) {
        throw {
            headerCode: 400,
            subCode: 0x01,
            errorMsg: "员工编号、姓名、身份证或手机号信息，与其他员工的信息重复，请确认！"
        }
    }

    await query(`UPDATE employee SET code = ?, name = ?, sex = ? , departmentId = ? , position = ?, entryTime = ?,birthday = ?,idNumber = ?,phoneNumber = ?,address= ?,remark = ? WHERE id = ?;`,
        [postData.code, postData.name, postData.sex, postData.departmentId, postData.position, postData.entryTime,
        postData.birthday, postData.idNumber, postData.phoneNumber, postData.address, postData.remark, postData.id]);

    ctx.body = {
        code: 200,
        data: [],
        message: 'update success'
    }
}

module.exports = { init };


