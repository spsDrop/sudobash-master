
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    Models = require('./models').Models,
    ViewRouter = require('./routes/view-router').ViewRouter,
    AWSController = require('./controllers/aws-controller').AWSController;
    
var app = express();

exports.sudoBashMaster = new SudoBashMaster(app);
    
    
function SudoBashMaster(app){
    var awsController = new AWSController(Models),
        viewRouter = new ViewRouter(awsController);
    
    init();
    
    function init(){
        configureApp();
        
        console.log("loading configs");
        awsController.loadConfigs(function configurationLoaded(configs){
            console.log("configs loaded");
            viewRouter.applyRoutes(app);
            
            http.createServer(app).listen(app.get('port'), function(){
                console.log("Express server listening on port " + app.get('port'));
            });
        });
    }
    
    function configureApp(){
        app.configure(function(){
            app.set('port', process.env.PORT || 3000);
            app.set('views', __dirname + '/views');
            app.set('view engine', 'jade');
            app.use(express.favicon());
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(app.router);
            app.use(express["static"](path.join(__dirname, 'public')));
        });
        app.configure('development', function(){
            app.use(express.errorHandler());
        });
    }
}

