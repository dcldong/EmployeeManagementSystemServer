CREATE DATABASE  IF NOT EXISTS employees;

use  employees;

create table department(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(50),
    code varchar(20),
    description varchar(100) 
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code varchar(20),
    name varchar(50),
    sex varchar(10),
    departmentId INT,
    position varchar(50),
    entryTime date,
    birthday date,
    idNumber varchar(50),
    phoneNumber varchar(50),
    address varchar(100),
    remark text,
    FOREIGN KEY (departmentId) REFERENCES department (id)
);

create table user(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userName varchar(50),
    password varchar(50),
    permission int,
    remark text
);
