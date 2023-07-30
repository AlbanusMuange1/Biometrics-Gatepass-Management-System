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
        `DROP TABLE IF EXISTS students;`
    );
  } catch (error){
    message = 'Could not delete database ' + error;
    success = false;
  }

  return {success, message};
}

async function init(){
  const connection = await mysql.createConnection(dbConfig);
  let message = 'Students table connected successfully';
  let success = true;

  try {
    await connection.query(
        `CREATE TABLE IF NOT EXISTS students 
        (
          id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name varchar(100) NOT NULL,
          reg_no varchar(100) UNIQUE NOT NULL,
          course varchar(255) NOT NULL,
          gender varchar(10) NOT NULL,
          year_and_semester varchar(255) NOT NULL,
          profile_photo TEXT,
          fingerprint LONGTEXT
        );`
    );
  } catch (error){
    message = 'Could not connect to the students table ' + error;
    success = false;
  }

  return {success, message};
}

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, name, reg_no, gender, course, year_and_semester, profile_photo, fingerprint 
    FROM students LIMIT ?,?`,
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    success: true,
    students: data,
    meta
  }
}

async function getSingle(id) {
  const rows = await db.query(
      `SELECT id, name, reg_no, gender, course, year_and_semester, profile_photo, fingerprint 
    FROM students WHERE id=?`,
      [id]
  );
  const data = helper.emptyOrRows(rows);

  return {
    success: true,
    student: data[0] ?? {},
  }
}

async function getSingleFromRegNo(regNo) {
  const rows = await db.query(
      `SELECT id, name, reg_no, gender, course, year_and_semester, profile_photo, fingerprint 
    FROM students WHERE reg_no=? ORDER BY reg_no DESC`,
      [regNo]
  );
  const data = helper.emptyOrRows(rows);

  return {
    success: true,
    student: data[0] ?? {},
  }
}

async function create(student){
  const result = await db.query(
    `INSERT INTO students 
    (name, reg_no, gender, course, year_and_semester, profile_photo, fingerprint) 
    VALUES 
    (?, ?, ?, ?, ?, ?, ?)`,
    [
      student.name, student.reg_no, student.gender,
      student.course, student.year_and_semester,
      student.profile_photo, student.fingerprint
    ]
  );

  let message = 'Error in creating student';
  let success = false;
  const inserted = result.insertId;

  const {student: record} = await getSingle(inserted);

  if (result.affectedRows) {
    message = 'Student created successfully';
    success = true;
  }

  return {success, message, student: record};
}

async function update(id, student){
  let query =
      `${student.name ? 'name=?' : ''}
      ${student.reg_no ? ', reg_no=?' : ''}
      ${student.gender ? ', gender=?' : ''}
      ${student.course ? ', course=?' : ''}
      ${student.year_and_semester ? ', year_and_semester=?' : ''}
      ${student.profile_photo ? ', profile_photo=?' : ''}
      ${student.fingerprint ? ', fingerprint=?' : ''}
      `;
  let p = [];
  if (student.name) p.push(student.name);
  if (student.reg_no) p.push(student.reg_no);
  if (student.gender) p.push(student.gender);
  if (student.course) p.push(student.course);
  if (student.year_and_semester) p.push(student.year_and_semester);
  if (student.profile_photo) p.push(student.profile_photo);
  if (student.fingerprint) p.push(student.fingerprint);

  const result = await db.query(
      `UPDATE students 
    SET ${query} 
    WHERE id=?`,
    [...p, id]
  );

  let message = 'Error in updating student';
  let success = false;

  if (result.affectedRows) {
    message = 'Student updated successfully';
    success = true;
  }

  return {success, message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM students WHERE id=?`,
    [id]
  );

  let message = 'Error in deleting student';
  let success = false;

  if (result.affectedRows) {
    message = 'Student deleted successfully';
    success = true;
  }

  return {success, message};
}

module.exports = {
  init,
  destroy,
  getMultiple,
  getSingle,
  getSingleFromRegNo,
  create,
  update,
  remove
}
