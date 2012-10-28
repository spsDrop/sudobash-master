var aws = require("aws-lib");


exports.AWSController  = function AWSController(Models){
    var ec2,
        status = {
            initialized: false,
            config: new Models.AWSConfig()
        };
    
    function initializeClient(accessKeyID, secretAccessKey){
        ec2 = aws.createEC2Client(accessKeyID, secretAccessKey);
        status.initialized = true;
    }

    function describeInstances(cb){
        cb = cb || function(){};
        ec2.call("DescribeInstances", {}, function(err, result) {
            cb(result);
        });
    }

    function describeTags(cb){
        cb = cb || function(){};
        ec2.call("DescribeInstances", {}, function(err, result) {
            cb(result);
        });
    }
    
    function loadConfigs(cb){
        cb = cb || function(){};
        
        Models.AWSConfig.all(function(err, configs){
            if(err){
                console.error("Error pulling configs from DB");
            }else{
                if(configs.length){
                    status.config = configs[0];
                    
                    initializeClient(
                        status.config.accessKeyID,
                        status.config.secretAccessKey
                    );
                }
                cb(configs);
            }
        });
    }
    
    function saveConfigs(accessKeyID, secretAccessKey, cb){
        cb = cb || function(){};
        
        status.config.accessKeyID = accessKeyID;
        status.config.secretAccessKey = secretAccessKey;
        
        status.config.save(function(err){
            if(err){
                console.error("Error saving configs to DB");
            }
            cb();
        });
    }
    
    return {
        status: status,
        initializeClient: initializeClient,
        
        loadConfigs:loadConfigs,
        saveConfigs:saveConfigs,
        describeInstances: describeInstances,
        describeTags: describeTags
    };
};