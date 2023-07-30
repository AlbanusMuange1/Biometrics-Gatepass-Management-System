const visitors = require('../services/visitors.service');

// visitors.destroy().then(res => console.log(res));
visitors.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await visitors.getMultiple(req.query.page));
  } catch (err) {
      console.error(`Error while getting visitors`, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
    res.json(await visitors.getSingle(req.params.id));
  } catch (err) {
    console.error(`Error while getting visitor`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await visitors.create(req.body));
  } catch (err) {
    console.error(`Error while creating visitor`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await visitors.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating visitor`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await visitors.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting visitor`, err.message);
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
