var fs = require('fs');
var pg = require('pg');

const config = require('../server/config.js');
const data = require('../data/standards.json');

const client = new pg.Client(config.database.options);
let queryCount = 0;
let sCount = 0;
let maxId = 0;
const errorS = [];
client.connect(function (err) {
	if (err) {
		return console.log(err);
	}
	const N = 1;

	for (let i = 0; i < Math.ceil(data.length / N); i++) {

		const chunk = data.slice(i * N, (i + 1) * N);

		const values = chunk.map(standard => {
			if (standard.id > maxId) maxId = standard.id;
			return `'${standard.id}', '${e(JSON.stringify(standard))}'`;
		});

		const request = 'INSERT INTO standards (id, data) VALUES (' + values.join('),(') + ')';
		queryCount++;
		client.query(request, function (err, result) {
			queryCount--;
			if (err) {
				console.log(err);
				errorS.push(request);
			}
			else {
				sCount++;
			}
			finish(client, queryCount, sCount);
		});
	}
	const request = "ALTER SEQUENCE standards_id_seq RESTART WITH " + (maxId + 1);
	queryCount++;
	client.query(request, function (err, result) {
		queryCount--;
		if (err) {
			console.log(err);
		}
		else {
			console.log("Sequence number has been changed");
		}
		finish(client, queryCount, sCount);
	});
});

function finish(client, queryCount, sCount) {
	if (queryCount === 0) {
		client.end();
		console.log('Standards added: ' + sCount);
		console.log('ERR count', errorS.length);
	}
}

function e(str) {
	return str.replace(/'/g, "''");
}
