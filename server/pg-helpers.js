let pg = require("pg");

function connect(options) {
  return new Promise(function (resolve, reject) {
    let client = new pg.Client(options);

    client.connect(function (err) {
      if (err)
        return reject({error: err, message: null});
      else
        return resolve(client);

    });
  });
}

function query(client, request, queryName) {
  return new Promise(function (resolve, reject) {
    client.query(request, function (err, result) {
      if (err)
        return reject({name: queryName, error: err, message: request});
      else
        return resolve({name: queryName, result: result});
    });
  });
}

function queryValues(client, request, values, queryName) {
  return new Promise(function (resolve, reject) {
    client.query(request, values, function (err, result) {
      if (err)
        return reject({error: err, message: request});
      else
        return resolve({name: queryName, result: result});
    });
  });
}

module.exports.connect = connect;
module.exports.query = query;
module.exports.queryValues = queryValues;
