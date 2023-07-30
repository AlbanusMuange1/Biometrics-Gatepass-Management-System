const students = require('../services/students.service');

// students.destroy().then(res => console.log(res));
students.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await students.getMultiple(req.query.page));
  } catch (err) {
      console.error(`Error while getting students`, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
      res.json(await students.getSingle(req.params.id));
  } catch (err) {
      console.error(`Error while getting student`, err.message);
      next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await students.create(req.body));
  } catch (err) {
    console.error(`Error while creating student`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await students.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating student`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await students.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting student`, err.message);
    next(err);
  }
}

module.exports = {
  get,
  getSingle,
  create,
  update,
  remove
};
