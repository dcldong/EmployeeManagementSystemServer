use  employees;
insert into department set code='CW',name='财务部', description='处理财务相关的工作';
insert into department set code='HR', name='人力资源部', description='处理人力资源相关的工作'; 

insert into employee set code='000001', name='jack', sex='男', departmentId=1, 
position='manager', entryTime='2023/1/1', birthday='1990/1/1', idNumber='111111111111', phoneNumber='15010101010',address='NAU',remark='test';
 
insert into user value(null,'admin','e10adc3949ba59abbe56e057f20f883e',1,"超级管理员");
insert into user value(null,'manager','e10adc3949ba59abbe56e057f20f883e',0,"普通管理员");