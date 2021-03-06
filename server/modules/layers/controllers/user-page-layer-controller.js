"use strict";
var UserPageLayer = require('../services/user-page-layer-service');
var token_auth = require('../../JWT_Checker/loginToken.js');
var express = require('express');
var router = express.Router();
var service = new UserPageLayer();
router.get('/list', token_auth, function (req, res) {
    service.getList(req.query.pageID).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.get('/single', token_auth, function (req, res) {
    var LayerID = req.query.rowid;
    service.get(LayerID).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.get('/getpagelayers', token_auth, function (req, res) {
    var PageID = req.query.pageID;
    service.getPageLayers(PageID).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.get('/userlist', token_auth, function (req, res) {
    var userid = req.query.userid;
    service.getUserLayer(userid).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.get('/getbylayer', token_auth, function (req, res) {
    var layerID = req.query.layerID;
    service.getByLayer(layerID).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.post('/single', token_auth, function (req, res) {
    var request = req.body;
    service.create(request).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.put('/update', token_auth, function (req, res) {
    var request = req.body;
    service.update(request).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.delete('/delete', token_auth, function (req, res) {
    var ID = req.query.ID;
    service.delete(ID).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
module.exports = router;

//# sourceMappingURL=../../../source-maps/modules/layers/controllers/user-page-layer-controller.js.map
