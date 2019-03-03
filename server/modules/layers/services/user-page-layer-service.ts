import Sequelize = require('sequelize');
import UserPageLayerModel = require('../models/user-page-layer-model');
import PageModel = require('../../users/models/page-model')
import LayerModel = require('../models/layers-model')
import ServerModel = require ('../models/servers-model')
import UserModel = require('../../users/models/user-model');
import UserPageInstanceModel = require('../../feature modules/models/user-page-instance-model')

class UserPageLayerService {

    getList(pageID: number): Promise<UserPageLayerModel.UserPageLayerInstance[]> {

        var findOptions: Sequelize.FindOptions = {
            order: [
                'ID'
            ]
        };

        if (pageID) {
            findOptions.where = {
                $and: [
                    { pageID: pageID}
                ]
            }
        }

        return UserPageLayerModel.Model.findAll(findOptions);
    }

    
    getPageLayers(pageID: number): any {
        var findOptions: Sequelize.FindOptions = {
            order: [
                'pageID'
            ]
        };

        if (pageID) {
            findOptions.where = {
                $and: [
                    { userPageID: pageID}
                ]
            }
        }


    
        findOptions.include = [PageModel.Model, LayerModel.Model, UserPageInstanceModel.Model]

        return UserPageLayerModel.Model.findAll({order: ['ID'], where: {$and: [{ userPageID: pageID}]}, include: [{model: PageModel.Model}, {model: UserPageInstanceModel.Model}, {model: LayerModel.Model, include: [ServerModel.Model]}]})
    }

    getUserLayer(userID: number): any {
        var findOptions: Sequelize.FindOptions = {
            order: [
                'userID'
            ]
        };

        if (userID) {
            findOptions.where = {
                $and: [
                    { userID: userID}
                ]
            }
        }

        //return UserPageLayerModel.Model.findAll({order: ['ID'], where: {$and: [{ userID: userID}]}, include: [{model: UserModel.Model}, {model: LayerModel.Model}, {model: PageModel.Model}]});
        return UserPageLayerModel.Model.findAll(findOptions);
    }

    getByLayer(layerID: number): any {
        var findOptions: Sequelize.FindOptions = {
            order: [
                'layerID'
            ]
        };

        if (layerID) {
            findOptions.where = {
                $and: [
                    {layerID: layerID}
                ]
            }
        }

        return UserPageLayerModel.Model.findAll(findOptions);
    }

    get(rowID: number): Promise<UserPageLayerModel.UserPageLayerInstance> {
        return UserPageLayerModel.Model.findById(rowID);
    }

    create(request: App.UserPageLayer): Promise<UserPageLayerModel.UserPageLayerInstance> {
        return UserPageLayerModel.Model.create(request);
    }

    update(request: App.UserPageLayer): Promise<UserPageLayerModel.UserPageLayerInstance> {
        
        return <any>(UserPageLayerModel.Model.findById(request.ID).then((UserPageLayerInstance) => {

            UserPageLayerInstance.layerID = request.layerID;
            UserPageLayerInstance.userID = request.userID;
            UserPageLayerInstance.defaultON = request.defaultON;
            UserPageLayerInstance.style = request.style;

            return UserPageLayerInstance.save();
        }));
    }

    delete(ID: number) {
        return UserPageLayerModel.Model.findById(ID).then((UserPageLayerInstance) => {

            return UserPageLayerInstance.destroy();

        });
    }

}

export = UserPageLayerService;