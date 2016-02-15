var queueUrl = process.env["QUEUE_URL"];
var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');
AWS.config.update({region: process.env["AWS_DEFAULT_REGION"]||'us-west-1'});

var ecs = new AWS.ECS();

var app = Consumer.create({
  queueUrl: queueUrl,
  handleMessage: function (message, done) {
    console.log("Received", message)
    var jobSpec = JSON.parse(message.Body);
    ecs.runTask(jobSpec, function(err, data) {
      if(err) {
        console.error("Unable to dispatch job because", err);
      } else {
        console.log("ECS said", data);
      }
      done(err, data);
    });
  }
});

app.on('error', function (err) {
  console.error("Error while consuming job", err.message);
});

app.start();
