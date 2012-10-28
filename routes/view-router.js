exports.ViewRouter = function ViewRouter(awsController){

    function applyRoutes(app){
        app.get('/', index);
        app.get('/config', renderConfigPage);
        app.post('/config', config);
    }

    function index(req, res){
        if(awsController.status.initialized){
            awsController.describeTags(function(data){
                res.render('index', { title: 'Express', items:data.reservationSet.item });
            });
        }else{
            renderConfigPage(req, res);
        }
    }
    
    function config(req, res){
        if(req.body.accessKeyID && req.body.secretAccessKey){
            awsController.saveConfigs(req.body.accessKeyID, req.body.secretAccessKey, function configsSaved(){
                renderConfigPage(req, res);
            });
        }else{
            renderConfigPage(req, res);
        }
    }
    
    function renderConfigPage(req,res){
        var config = awsController.status.config.toObject();
        
        delete config.id;
        
        res.render('config',{
            title: 'Configure AWS Credentials',
            config: config
        });
    }
    
    return {
        applyRoutes: applyRoutes
    };
};