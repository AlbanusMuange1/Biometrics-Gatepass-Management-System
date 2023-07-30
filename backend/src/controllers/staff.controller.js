const staff = require('../services/staff.service');

// staff.destroy().then(res => console.log(res));
staff.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await staff.getMultiple(req.query.page));
  } catch (err) {
      console.error(`Error while getting staff members`, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
    res.json(await staff.getSingle(req.params.id));
  } catch (err) {
    console.error(`Error while getting staff`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await staff.create(req.body));
  } catch (err) {
    console.error(`Error while creating staff member`, err.message);
    next(err);
  }
}

async function login(req, res, next) {
  try {
    res.json(await staff.login(req.body));
  } catch (err) {
    console.error(`Error while creating staff member`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await staff.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating staff member`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await staff.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting staff member`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  getSingle,
  create,
  login,
  update,
  remove
};
