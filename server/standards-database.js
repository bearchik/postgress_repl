const pg = require("pg");
const helpers = require("./helpers");

function getStandards(options, onGetStandards) {
  const client = new pg.Client(options);

  client.connect(function (err) {
    if (err) {
      return onGetStandards(err, null);
    }

    const request = "SELECT id, data FROM standards ORDER BY id";

    return client.query(request, function (err, result) {
      let res = null;

      if (err) {
        helpers.log(request + "\t\t" + err);
      }
      else {
        res = [];
        result.rows.forEach(function (row) {
          const standard = JSON.parse(row.data);
          standard.id = row.id;
          res.push(standard);
        });
      }

      client.end();
      return onGetStandards(err, res);
    });
  });
}

function getStandard(options, id, onGetStandard) {
  const client = new pg.Client(options);

  client.connect(function (err) {
    if (err) {
      return onGetStandard(err, null);
    }

    const request = "SELECT id, data FROM standards WHERE id = " + id;

    return client.query(request, function (err, result) {
      let res = null;

      if (err) {
        helpers.log(request + "\t\t" + err);
      }
      else {
        if (result.rowCount == 1) {
          res = JSON.parse(result.rows[0].data);
          res.id = result.rows[0].id;
        }
        else
          res = null;
      }

      client.end();
      return onGetStandard(err, res);
    });
  });
}

function add(options, standard, onAddStandard) {
  let client = new pg.Client(options);

  client.connect(function (err) {
    if (err) {
      return onAddStandard(err, null);
    }

    if (standard.hasOwnProperty("id"))
      delete standard.id;

    let request = "INSERT INTO standards (data) VALUES ($1) RETURNING id, data";
    let values = [JSON.stringify(standard)];

    return client.query(request, values, function (err, result) {
      let res = null;

      if (err) {
        helpers.log(request + "\t\t" + err);
      }
      else {
        if (result.rowCount == 1) {
          res = JSON.parse(result.rows[0].data);
          res.id = result.rows[0].id;
        }
        else
          res = null;
      }

      client.end();
      return onAddStandard(err, res);
    });
  });
}

function updateById(options, id, standard, onUpdateStandard) {
  let client = new pg.Client(options);

  client.connect(function (err) {
    if (err) {
      return onUpdateStandard(err, null);
    }

    if (standard.hasOwnProperty("id"))
      delete standard.id;

    let request = "UPDATE standards SET data = $1 WHERE id = " + id + " RETURNING id, data";
    let values = [JSON.stringify(standard)];

    return client.query(request, values, function (err, result) {
      let res = null;

      if (err) {
        helpers.log(request + "\t\t" + err);
      }
      else {
        if (result.rowCount == 1) {
          res = JSON.parse(result.rows[0].data);
          res.id = result.rows[0].id;
        }
        else
          res = null;
      }

      client.end();
      return onUpdateStandard(err, res);
    });
  });
}

function deleteStandard(options, id, onDeleteStandard) {
  let client = new pg.Client(options);

  client.connect(function (err) {
    if (err) {
      return onDeleteStandard(err, null);
    }

    let request = "DELETE FROM standards WHERE id = " + id;

    return client.query(request, function (err, result) {
      let res = null;

      if (err) {
        helpers.log(request + "\t\t" + err);
      }
      else {
        if (result.rowCount == 1)
          res = null;
        else
          res = {};
      }

      client.end();
      return onDeleteStandard(err, res);
    });
  });
}

module.exports = {
  getStandards,
  getStandard,
  add,
  updateById,
  deleteStandard,
};
