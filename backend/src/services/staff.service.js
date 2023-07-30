const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../configs/general.config');
const mysql = require("mysql2/promise");
const dbConfig = require("../configs/db.config");
const util = require("util");

async function destroy(){
  const connection = await mysql.createConnection(dbConfig);
  let message = 'Database deleted successfully';
  let success = true;

  try {
    await connection.query(
        `DROP TABLE IF EXISTS staff;`
    );
  } catch (error){
    message = 'Could not delete database ' + error;
    success = false;
  }

  return {success, message};
}

async function init(){
  const connection = await mysql.createConnection(dbConfig);
  let message = 'Staff table connected successfully';
  let success = true;

  try {
    await connection.query(
        `CREATE TABLE IF NOT EXISTS staff 
        (
          id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name varchar(100) NOT NULL,
          employee_no varchar(100) UNIQUE NOT NULL,
          title varchar(100) NOT NULL,
          gender varchar(10) NOT NULL,
          profile_photo TEXT,
          fingerprint LONGTEXT
        );`
    );
  } catch (error){
    message = 'Could not connect to the staff table ' + error;
    success = false;
  }

  return {success, message};
}

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, name, employee_no, title, gender, profile_photo, fingerprint 
    FROM staff LIMIT ?,?`,
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    success: true,
    staff: data,
    meta
  }
}

async function getSingle(id) {
  const rows = await db.query(
      `SELECT id, name, employee_no, title, gender, profile_photo, fingerprint 
    FROM staff WHERE id=?`
      [id]
  );
  const data = helper.emptyOrRows(rows);

  return {
    success: true,
    staff: data[0] ?? {},
  }
}

async function getSingleFromEmployeeNumber(employeeNumber) {
  const rows = await db.query(
      `SELECT id, name, employee_no, title, gender, profile_photo, fingerprint 
    FROM staff WHERE employee_no=? ORDER BY employee_no DESC`,
      [employeeNumber]
  );
  const data = helper.emptyOrRows(rows);

  return {
    success: true,
    staff: data[0] ?? {},
  }
}

async function create(staff_member){
  const result = await db.query(
    `INSERT INTO staff 
    (name, employee_no, title, gender, profile_photo, fingerprint) 
    VALUES 
    (?, ?, ?, ?, ?, ?)`,
    [
      staff_member.name, staff_member.employee_no,
      staff_member.title, staff_member.gender,
      staff_member.profile_photo, staff_member.fingerprint
    ]
  );

  let message = 'Error in creating staff member';
  let success = false;

  const inserted = result.insertId;

  const {staff: record} = await getSingle(inserted);


  if (result.affectedRows) {
    message = 'Staff member created successfully';
    success = true;
  }

  return {success, message, staff: record};
}

async function login(staff_member){
  const ACCOUNTS = [
    {
      name: "Gate B Security",
      username: "user",
      password: "test",
      role: "SECURITY"
    },
    {
      name: "Administrator",
      username: "admin",
      password: "admin",
      role: "ADMIN"
    },
  ];
  let user = null;
  for (let account of ACCOUNTS){
    if (account.username === staff_member.username && account.password === staff_member.password){
      user = {...account, password: "•".repeat(account.password.length)};
      break;
    }
  }

  let message = user ? 'Successful login.' : 'Invalid credentials.';
  let success = !!user;

  return {success, message, staff: user};
}

async function update(id, staff_member){
  let query =
      `${staff_member.name ? 'name=?' : ''}
      ${staff_member.employee_no ? ', employee_no=?' : ''}
      ${staff_member.title ? ', title=?' : ''}
      ${staff_member.gender ? ', gender=?' : ''}
      ${staff_member.profile_photo ? ', profile_photo=?' : ''}
      ${staff_member.fingerprint ? ', fingerprint=?' : ''}
      `;
  let p = [];
  if (staff_member.name) p.push(staff_member.name);
  if (staff_member.employee_no) p.push(staff_member.employee_no);
  if (staff_member.title) p.push(staff_member.title);
  if (staff_member.gender) p.push(staff_member.gender);
  if (staff_member.profile_photo) p.push(staff_member.profile_photo);
  if (staff_member.fingerprint) p.push(staff_member.fingerprint);

  const result = await db.query(
      `UPDATE staff 
    SET ${query} 
    WHERE id=?`,
    [...p, id]
  );

  let message = 'Error in updating staff member';
  let success = false;

  if (result.affectedRows) {
    message = 'Staff member updated successfully';
    success = true;
  }

  return {success, message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM staff WHERE id=?`,
    [id]
  );

  let message = 'Error in deleting staff member';
  let success = false;

  if (result.affectedRows) {
    message = 'Staff member deleted successfully';
    success = true;
  }

  return {success, message};
}

module.exports = {
  init,
  destroy,
  getMultiple,
  getSingle,
  getSingleFromEmployeeNumber,
  create,
  login,
  update,
  remove
}
