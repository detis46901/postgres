import dbConnection = require('../../../core/db-connection');
import Sequelize = require('sequelize');

var db = dbConnection();

export interface RoleInstance extends Sequelize.Instance<RoleInstance, App.Role>, App.Role { }
export interface RoleModel extends Sequelize.Model<RoleInstance, App.Role> { }


var sequalizeModel = db.define<RoleInstance, App.Role>('role', <any>{
    ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    groupID: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1
        }
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 30]
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        validate: {
            is: ["[a-z]",'i'] //only allow letters
        }
    }
});

sequalizeModel.sync()    

export var Model = sequalizeModel;