function log(msg) {
  return console.log("[" + new Date().toString() + "] " + msg);
}

function parseBody(req, res, next) {
  let data = "";
  req.body = null;
  req.setEncoding("utf8");

  req.on("data", function (chunk) {
    data += chunk;
  });

  req.on("end", function () {
    if (data == "")
      data = "{}";

    try {
      req.body = JSON.parse(data);
    }
    catch (e) {
      return sendFail(res, "Can't parse incoming JSON")
    }

    return next();
  });
}

function sendResult(res, result) {
  res.status(result.code);
  res.set("Content-Type", "application/json");
  result.time = Date.now();
  res.send(JSON.stringify(result));
}

function sendSuccess(res, data) {
  const result = {code: 200, status: "sucess", data: data};
  return sendResult(res, result);
}

function sendFail(res, message) {
  const result = {code: 400, status: "fail", data: {message: message}};
  return sendResult(res, result);
}

function sendError(res, message) {
  const result = {code: 500, status: "error", message: message};
  return sendResult(res, result);
}

function sendWrongCommand(res) {
  return sendFail(res, "Wrong command");
}

/*
 function sendDatabaseError(res)
 {
 return sendError(res, "Internal server error: database error");
 }
 */

module.exports.log = log;
module.exports.parseBody = parseBody;
module.exports.sendResult = sendResult;
module.exports.sendSuccess = sendSuccess;
module.exports.sendFail = sendFail;
module.exports.sendError = sendError;
module.exports.sendWrongCommand = sendWrongCommand;
//module.exports.sendDatabaseError = sendDatabaseError;
