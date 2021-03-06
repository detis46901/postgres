"use strict";
/// <reference path='_references.ts' />
var express = require('express');
var body_parser_1 = require('body-parser');
var errorHandler = require('errorhandler');
var cors = require('cors');
var path_1 = require('path');
var AuthenticateController = require('./modules/users/controllers/authenticate-controller');
var GroupController = require('./modules/users/controllers/group-controller');
var UserController = require('./modules/users/controllers/user-controller');
var GroupMemberController = require('./modules/users/controllers/group-member-controller');
var NotificationController = require('./modules/users/controllers/notification-controller');
var LayerController = require('./modules/layers/controllers/layers-controller');
var PageController = require('./modules/users/controllers/page-controller');
var UserPageLayerController = require('./modules/layers/controllers/user-page-layer-controller');
var LayerPermissionController = require('./modules/layers/controllers/layers-permission-controller');
var ServerController = require('./modules/layers/controllers/servers-controller');
var SQLController = require('./modules/postGIS_layers/controllers/sql-controller');
var geoJSONController = require('./modules/postGIS_layers/controllers/geoJSON-controller');
var ModuleController = require('./modules/feature modules/controllers/module-controller');
var ModuleInstancesController = require('./modules/feature modules/controllers/module-instances-controller');
var ModulePermissionController = require('./modules/feature modules/controllers/module-permission-controller');
var UserPageInstanceController = require('./modules/feature modules/controllers/user-page-instance-controller');
var MapConfigController = require('./modules/mapConfig/controllers/mapConfig-controller');
var DomainController = require('./modules/domain/controllers/domain-controller');
var LoginLogController = require('./modules/logs/controllers/loginlog-controller');
// This portion of code is required to serve as a proxy 
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 9876;
var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
var app = express();
// Configuration
app.set('port', 5000);
app.set('views', path_1.join(__dirname, '/views')); // critical to use path.join on windows
app.set('view engine', 'vash');
app.set('view options', { layout: false });
app.use(body_parser_1.urlencoded({ extended: true }));
// app.use(json());
app.use(cors()); //I had to go into the cors index.js file and change the preflightcontinue to "true"
app.use(express.static(path_1.join(__dirname, '/../client')));
app.use(errorHandler());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
// Routes
//app.use('/api/parent', ParentController);
app.use('/api/users', UserController);
app.use('/api/layer', LayerController);
app.use('/api/authenticate', AuthenticateController);
app.use('/api/group', GroupController);
app.use('/api/groupmember', GroupMemberController);
app.use('/api/notification', NotificationController);
app.use('/api/layerpermission', LayerPermissionController);
app.use('/api/userpagelayer', UserPageLayerController);
app.use('/api/userpage', PageController);
app.use('/api/server', ServerController);
app.use('/api/sql', SQLController);
app.use('/api/geojson', geoJSONController);
app.use('/api/module', ModuleController);
app.use('/api/moduleinstance', ModuleInstancesController);
app.use('/api/modulepermission', ModulePermissionController);
app.use('/api/userpageinstance', UserPageInstanceController);
app.use('/api/mapconfig', MapConfigController);
app.use('/api/domain', DomainController);
app.use('/api/loginlog', LoginLogController); //may want to make this more generic for other logs (not just login)
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
exports.App = app;
//import http = require('http');
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(1337, '127.0.0.1');
//console.log('Server running at http://127.0.0.1:1337/'); 

//# sourceMappingURL=source-maps/app.js.map
