"use strict";
var dbConnection = require('../../../core/db-connection');
var Sequelize = require('sequelize');
var sequelize = require('sequelize');
var ServerModel = require('./servers-model');
var DomainModel = require('../../domain/models/domain-model');
var db = dbConnection();
var sequalizeModel = db.define('layer', {
    ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    layerName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 30]
        }
    },
    layerType: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 30]
        }
    },
    layerService: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 200]
        }
    },
    layerIdent: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 200]
        }
    },
    layerFormat: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 200]
        }
    },
    layerDescription: {
        type: sequelize.TEXT,
        allowNull: true
    },
    layerGeom: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            len: [1, 200]
        }
    },
    defaultStyle: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: '{"load":{"color":"#000000","width":2},"current":{"color":"#000000","width":4}}'
    }
});
sequalizeModel.belongsTo(ServerModel.Model);
sequalizeModel.belongsTo(DomainModel.Model);
sequalizeModel.sync();
exports.Model = sequalizeModel;

//# sourceMappingURL=../../../source-maps/modules/layers/models/layers-model.js.map
