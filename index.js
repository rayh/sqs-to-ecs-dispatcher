var queueUrl = process.env["QUEUE_URL"];
var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');

AWS.config.update({region: process.env["AWS_DEFAULT_REGION"]||'us-west-2'});

var ecs = new AWS.ECS();

var app = Consumer.create({
  queueUrl: queueUrl,
  batchSize: 1,
  handleMessage: function (message, done) {
    console.log("Received", message)
    var jobSpec = JSON.parse(message.Body);
    jobSpec.overrides.containerOverrides.forEach(function(o) {
      o.environment = o.environment||[];
      o.environment.push({
        name: 'JOB_SQS_QUEUE_URL',
        value: queueUrl
      })
      o.environment.push({
        name: 'JOB_SQS_MESSAGE_ID',
        value: message.MessageId
      })
      o.environment.push({
        name: 'JOB_SQS_MESSAGE_HASH',
        value: message.MD5OfBody
      })
    })

    ecs.runTask(jobSpec, function(err, data) {
      if(err) {
        console.error("Unable to dispatch job because", err);
        done(err);
      } else if(data.failures.length>0) {
        console.error("Unable to dispatch job because", data.failures[0].reason);
        done(new Error(data.failures[0].reason));
      } else {
        console.log("ECS said", data);
        done();
      }
    });
  }
});

app.on('error', function (err) {
  console.error("Error while consuming job", err.message);
});

app.start();
