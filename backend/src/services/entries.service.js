const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../configs/general.config');
const mysql = require("mysql2/promise");
const dbConfig = require("../configs/db.config");
const util = require("util");
const studentService = require("../services/students.service")
const staffService = require("../services/staff.service")
const visitorService = require("../services/visitors.service")

async function destroy() {
    const connection = await mysql.createConnection(dbConfig);
    let message = 'Database deleted successfully';
    let success = true;

    try {
        await connection.query(
            `DROP TABLE IF EXISTS entries;`
        );
    } catch (error) {
        message = 'Could not delete database ' + error;
        success = false;
    }

    return {success, message};
}

async function init() {
    const connection = await mysql.createConnection(dbConfig);
    let message = 'Entries table connected successfully';
    let success = true;

    try {
        await connection.query(
            `CREATE TABLE IF NOT EXISTS entries 
        (
          id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_type varchar(100) NOT NULL,
          identification varchar(100) NOT NULL,
          date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`
        );
    } catch (error) {
        message = 'Could not connect to the entries table ' + error;
        success = false;
    }

    return {success, message};
}

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, user_type, identification, date_time 
    FROM entries LIMIT ?,?`,
        [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows);
    let entries = [];
    const meta = {page};

    // get profile image based on user_type
    for (const item of data){
        const index = data.indexOf(item);
        const userType = item.user_type;
        let user, image = '';
        if (userType === "STUDENT") {
            const {student: obj} = await studentService.getSingleFromRegNo(item.identification);
            user = obj;
        } else if (userType === "STAFF") {
            const {staff: obj} = await staffService.getSingleFromEmployeeNumber(item.identification);
            user = obj;
        } else if (userType === "VISITOR") {
            const {visitor: obj} = await visitorService.getSingleFromIDNumber(item.identification);
            user = obj;
        }
        image = user.profile_photo ?? '';
        entries[index] = {...item, profile_photo: image};
    }

    return {
        success: true,
        entries,
        meta
    }
}

async function getSingle(id) {
    const rows = await db.query(
        `SELECT id, user_type, identification, date_time 
    FROM entries WHERE id=?`,
        [id]
    );
    const data = helper.emptyOrRows(rows);

    return {
        success: true,
        entry: data[0] ?? {},
    }
}

async function create(entry) {
    const result = await db.query(
        `INSERT INTO entries 
    (user_type, identification ) 
    VALUES 
    (?, ?)`,
        [
            entry.user_type, entry.identification
        ]
    );

    let message = 'Error in creating entry';
    let success = false;
    const inserted = result.insertId;

    const {entry: record} = await getSingle(inserted);

    if (result.affectedRows) {
        message = 'Entry created successfully';
        success = true;
    }

    return {success, message, entry: record};
}

async function update(id, entry) {
    let query =
        `${entry.user_type ? 'user_type=?' : ''}
      ${entry.identification ? ', identification=?' : ''}
      `;
    let p = [];
    if (entry.user_type) p.push(entry.user_type);
    if (entry.identification) p.push(entry.identification);

    const result = await db.query(
        `UPDATE entries 
    SET ${query} 
    WHERE id=?`,
        [...p, id]
    );

    let message = 'Error in updating entry';
    let success = false;

    if (result.affectedRows) {
        message = 'Entry updated successfully';
        success = true;
    }

    return {success, message};
}

async function remove(id) {
    const result = await db.query(
        `DELETE FROM entries WHERE id=?`,
        [id]
    );

    let message = 'Error in deleting entry';
    let success = false;

    if (result.affectedRows) {
        message = 'Entry deleted successfully';
        success = true;
    }

    return {success, message};
}

module.exports = {
    init,
    destroy,
    getMultiple,
    getSingle,
    create,
    update,
    remove
}
