"use strict";
var express = require('express');
var LayerAdminService = require('../services/layers-admin-service');
var token_auth = require('../../JWT_Checker/loginToken.js');
var router = express.Router();
var service = new LayerAdminService();
router.get('/list', token_auth, function (req, res) {
    service.getList(req.query.searchValue).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.get('/one', token_auth, function (req, res) {
    var LayerAdmin = req.query.rowid;
    service.get(LayerAdmin).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
});
router.post('/create', token_auth, function (req, res) {
    console.log(token_auth);
    var request = req.body;
    service.create(request).then(function (result) {
        res.send(result);
        console.log(result);
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
    //if(req.body.layerPerm.delete) {
    var ID = req.query.ID;
    console.log(ID);
    service.delete(ID).then(function (result) {
        res.send(result);
    }).catch(function (error) {
        res.send(error);
    });
    // } else {
    //     res.status(500).json({
    //         message:"You do not have permission to delete this permission entry."
    //     })
    // }
});
module.exports = router;

//# sourceMappingURL=../../../source-maps/modules/layers/controllers/layers-admin-controller.js.map
