const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../configs/general.config');
const mysql = require("mysql2/promise");
const dbConfig = require("../configs/db.config");
const util = require("util");

async function destroy() {
    const connection = await mysql.createConnection(dbConfig);
    let message = 'Database deleted successfully';
    let success = true;

    try {
        await connection.query(
            `DROP TABLE IF EXISTS visitors;`
        );
    } catch (error) {
        message = 'Could not delete database ' + error;
        success = false;
    }

    return {success, message};
}

async function init() {
    const connection = await mysql.createConnection(dbConfig);
    let message = 'Visitors table connected successfully';
    let success = true;

    try {
        await connection.query(
            `CREATE TABLE IF NOT EXISTS visitors 
        (
          id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name varchar(100) NOT NULL,
          id_no varchar(25) NOT NULL,
          purpose_of_visit TEXT NOT NULL,
          gender varchar(10) NOT NULL,
          profile_photo TEXT,
          fingerprint LONGTEXT,
          date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`
        );
    } catch (error) {
        message = 'Could not connect to the visitors table ' + error;
        success = false;
    }

    return {success, message};
}

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, name, id_no, purpose_of_visit, gender, profile_photo, fingerprint, date_time
    FROM visitors LIMIT ?,?`,
        [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
        success: true,
        visitors: data,
        meta
    }
}

async function getSingle(id) {
    const rows = await db.query(
        `SELECT id, name, id_no, purpose_of_visit, gender, profile_photo, fingerprint, date_time
    FROM visitors WHERE id=?`,
        [id]
    );
    const data = helper.emptyOrRows(rows);

    return {
        success: true,
        visitor: data[0] ?? {},
    }
}

async function getSingleFromIDNumber(idNo) {
    const rows = await db.query(
        `SELECT id, name, id_no, purpose_of_visit, gender, profile_photo, fingerprint, date_time
    FROM visitors WHERE id_no=? ORDER BY date_time DESC`,
        [idNo]
    );
    const data = helper.emptyOrRows(rows);

    return {
        success: true,
        visitor: data[0] ?? {},
    }
}

async function create(visitor) {
    const result = await db.query(
        `INSERT INTO visitors 
    (name, id_no, purpose_of_visit, gender, profile_photo, fingerprint) 
    VALUES 
    (?, ?, ?, ?, ?, ?)`,
        [
            visitor.name, visitor.id_no,
            visitor.purpose_of_visit, visitor.gender,
            visitor.profile_photo, visitor.fingerprint
        ]
    );

    let message = 'Error in creating visitor';
    let success = false;

    const inserted = result.insertId;

    const {visitor: record} = await getSingle(inserted);

    if (result.affectedRows) {
        message = 'Visitor created successfully';
        success = true;
    }

    return {success, message, visitor: record};
}

async function update(id, visitor) {
    let query =
        `${visitor.name ? 'name=?' : ''}
      ${visitor.id_no ? ', id_no=?' : ''}
      ${visitor.purpose_of_visit ? ', purpose_of_visit=?' : ''}
      ${visitor.gender ? ', gender=?' : ''}
      ${visitor.profile_photo ? ', profile_photo=?' : ''}
      ${visitor.fingerprint ? ', fingerprint=?' : ''}
      `;
    let p = [];
    if (visitor.name) p.push(visitor.name);
    if (visitor.id_no) p.push(visitor.id_no);
    if (visitor.purpose_of_visit) p.push(visitor.purpose_of_visit);
    if (visitor.gender) p.push(visitor.gender);
    if (visitor.profile_photo) p.push(visitor.profile_photo);
    if (visitor.fingerprint) p.push(visitor.fingerprint);

    const result = await db.query(
        `UPDATE visitors 
    SET ${query} 
    WHERE id=?`,
        [...p, id]
    );

    let message = 'Error in updating visitor';
    let success = false;

    if (result.affectedRows) {
        message = 'Visitor updated successfully';
        success = true;
    }

    return {success, message};
}

async function remove(id) {
    const result = await db.query(
        `DELETE FROM visitors WHERE id=?`,
        [id]
    );

    let message = 'Error in deleting visitor';
    let success = false;

    if (result.affectedRows) {
        message = 'Visitor deleted successfully';
        success = true;
    }

    return {success, message};
}

module.exports = {
    init,
    destroy,
    getMultiple,
    getSingle,
    getSingleFromIDNumber,
    create,
    update,
    remove
}
