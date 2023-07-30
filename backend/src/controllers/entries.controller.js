const entries = require('../services/entries.service');

// entries.destroy().then(res => console.log(res));
entries.init().then(res => console.log(res));

async function get(req, res, next) {
  try {
      res.json(await entries.getMultiple(req.query.page));
  } catch (err) {
      console.error(`Error while getting entries`, err.message);
      next(err);
  }
}

async function getSingle(req, res, next) {
  try {
    res.json(await entries.getSingle(req.params.id));
  } catch (err) {
    console.error(`Error while getting entry`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await entries.create(req.body));
  } catch (err) {
    console.error(`Error while creating entry`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await entries.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating entry`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await entries.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting entry`, err.message);
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
