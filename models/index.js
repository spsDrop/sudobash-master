var Schema = require("jugglingdb").Schema,
    schema = new Schema('redis', {port: 6379});

exports.Models = {};

var AWSConfig = exports.Models.AWSConfig = schema.define('AWSConfig',{
    accessKeyID:{type: String},
    secretAccessKey:{type: String}
});