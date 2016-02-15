# Simple SQS => ECS Dispatcher

Simply send your ECS job params to an SQS queue (i.e what you would have sent to runTask using the node AWS SDK).  Run this as a service in your ECS cluster and it will poll the SQS queue and simply dispatch the jobs to ECS.  If ECS returns an error (lack of CPU/Memory, etc) - the job will go back simply be reprocessed at a later time.

## Environment variables

To configure this service, simply pass in the usual AWS_* env variables or use IAM roles.

To set the queue, define QueueUrl
