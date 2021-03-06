"use strict";
var dbConnection = require('../../../core/db-connection');
var Sequelize = require('sequelize');
var UserModel = require('../../users/models/user-model');
var db = dbConnection();
var SQLService = (function () {
    function SQLService() {
    }
    SQLService.prototype.get = function (schema, table) {
        if (schema == 'mycube') {
            return db.query("SELECT *,ST_Length(ST_Transform(geom,2965)), ST_Area(ST_Transform(geom,2965)) from " + schema + "." + table + ' ORDER BY id');
        }
        else {
            return db.query("SELECT * from " + schema + "." + table + ' ORDER BY id');
        }
    };
    SQLService.prototype.getUserFromAPIKey = function (apikey) {
        var findOptions = {
            order: [
                'apikey'
            ]
        };
        if (apikey) {
            findOptions.where = {
                apikey: (_a = {}, _a[Sequelize.Op.eq] = "" + apikey, _a)
            };
        }
        return UserModel.model.findAll(findOptions);
        var _a;
    };
    SQLService.prototype.getsheets = function (schema, table) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var responsehtml = "<html><body><table>";
            _this.getschema(schema, table).then(function (schemaarray) {
                var schema2 = schemaarray[0];
                //header information
                responsehtml += "<tr>";
                schema2.forEach(function (schemaelement) {
                    if (schemaelement['field'] != 'geom') {
                        responsehtml += "<th>" + [schemaelement['field']] + "</th>";
                    }
                });
                if (schema == 'mycube') {
                    responsehtml += "<th>Length (ft)</th>";
                    responsehtml += "<th>Area (sqft)</th>";
                }
                responsehtml += "</tr>";
                _this.get(schema, table).then(function (dataarray) {
                    var data = (dataarray[0]);
                    data.forEach(function (dataelement) {
                        responsehtml += "<tr>";
                        schema2.forEach(function (schemaelement) {
                            if (schemaelement['field'] != 'geom') {
                                if (!dataelement[schemaelement['field']] || dataelement[schemaelement['field']] == "null") {
                                    dataelement[schemaelement['field']] = "";
                                }
                                responsehtml += "<td>" + dataelement[schemaelement['field']] + "</td>";
                            }
                        });
                        if (schema == 'mycube') {
                            responsehtml += "<td>" + dataelement['st_length'] + '</td>';
                            responsehtml += "<td>" + dataelement['st_area'] + '</td>';
                        }
                        responsehtml += "</tr>";
                    });
                    responsehtml += "</table></body></html>";
                    resolve(responsehtml);
                });
            });
        });
        return promise;
    };
    SQLService.prototype.getlength = function (table, id) {
        return db.query('SELECT ST_Length(ST_Transform(geom,2965)) from mycube.t' + table + ' WHERE id=' + id + ';');
    };
    SQLService.prototype.create = function (table) {
        return db.query("CREATE TABLE mycube.t" + table + " (\n                ID    SERIAL PRIMARY KEY,\n                geom   geometry\n            );\n        ");
    };
    SQLService.prototype.getConstraints = function (schema, table) {
        return db.query("SELECT con.*\n        FROM pg_catalog.pg_constraint con\n             INNER JOIN pg_catalog.pg_class rel\n                        ON rel.oid = con.conrelid\n             INNER JOIN pg_catalog.pg_namespace nsp\n                        ON nsp.oid = connamespace\n        WHERE nsp.nspname = '" + schema + "'\n              AND rel.relname = '" + table + "';");
    };
    SQLService.prototype.createCommentTable = function (table) {
        return db.query("CREATE TABLE mycube.c" + table + " (\n            ID   SERIAL PRIMARY KEY,\n            userID integer,\n            comment text,\n            geom geometry,\n            featureChange boolean,\n            filename text,\n            file bytea,\n            auto boolean,\n            featureID integer,\n            createdAt timestamp with time zone default now());\n            ");
    };
    SQLService.prototype.setSRID = function (table) {
        return db.query("SELECT UpdateGeometrySRID('mycube', 't" + table + "','geom',4326);");
    };
    SQLService.prototype.addColumn = function (table, field, type, label, myCubeField) {
        db.query('ALTER TABLE mycube.t' + table + ' ADD "' + myCubeField.field + '" ' + myCubeField.type);
        //if (label == true) { db.query(`COMMENT ON COLUMN mycube.t` + table + '."' + field + `" IS '` + field + `';`) }
        return db.query("SELECT col_description(41644,3);");
    };
    SQLService.prototype.deleteColumn = function (table, myCubeField) {
        return db.query('ALTER TABLE mycube.t' + table + ' DROP "' + myCubeField.field + '"');
    };
    SQLService.prototype.moveColumn = function (table, myCubeField) {
        var _this = this;
        var rnd = Math.trunc(Math.random() * 100);
        var promise = new Promise(function (resolve, reject) {
            _this.mC1(table, myCubeField, rnd).then(function () {
                _this.mC2(table, myCubeField, rnd).then(function () {
                    _this.mC3(table, myCubeField).then(function () {
                        _this.mc4(table, myCubeField, rnd).then(function () { resolve(); });
                    });
                });
            });
        });
        return promise;
    };
    SQLService.prototype.mC1 = function (table, myCubeField, rnd) {
        return db.query('ALTER TABLE mycube.t' + table + ' ADD layer' + rnd + ' ' + myCubeField.type);
    };
    SQLService.prototype.mC2 = function (table, myCubeField, rnd) {
        return db.query('UPDATE mycube.t' + table + ' SET layer' + rnd + ' = "' + myCubeField.field + '"');
    };
    SQLService.prototype.mC3 = function (table, myCubeField) {
        return db.query('ALTER TABLE mycube.t' + table + ' DROP "' + myCubeField.field + '"');
    };
    SQLService.prototype.mc4 = function (table, myCubeField, rnd) {
        return db.query('ALTER TABLE mycube.t' + table + ' RENAME layer' + rnd + ' TO "' + myCubeField.field + '"');
    };
    SQLService.prototype.updateConstraint = function (schema, table, myCubeField) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var constraint = "";
            var i = 1;
            // this.deleteConstraint(schema, table, myCubeField.field).then(() => {
            if (myCubeField.constraints) {
                myCubeField.constraints.forEach(function (x) {
                    if (myCubeField.type == 'integer' || myCubeField.type == 'double precision') {
                        constraint = constraint + '"' + myCubeField.field + '"' + "= " + x.name;
                    }
                    else {
                        constraint = constraint + '"' + myCubeField.field + '"' + "='" + x.name + "'";
                    }
                    if (i < myCubeField.constraints.length) {
                        constraint = constraint + " OR ";
                    }
                    i = i + 1;
                });
                if (constraint) {
                    _this.deleteConstraint(schema, table, myCubeField.field).then(function (result) {
                        _this.addConstraint(schema, table, myCubeField.field, constraint).then(function (result) {
                            resolve();
                        });
                    }).catch(function (error) {
                        _this.addConstraint(schema, table, myCubeField.field, constraint).then(function (result) { resolve(); });
                    });
                }
                else {
                    resolve();
                }
            }
        });
        return promise;
    };
    SQLService.prototype.addConstraint = function (schema, table, field, constraint) {
        //this can fail at times if there is already a constraint
        return db.query('ALTER TABLE ' + schema + '.t' + table + ' ADD CONSTRAINT "' + field + '_types" CHECK (' + constraint + ');');
    };
    SQLService.prototype.deleteConstraint = function (schema, table, field) {
        return db.query('ALTER TABLE ' + schema + '.t' + table + ' DROP CONSTRAINT ' + field + '_types');
    };
    SQLService.prototype.deleteTable = function (table) {
        return db.query('DROP TABLE mycube.t' + table);
    };
    SQLService.prototype.deleteCommentTable = function (table) {
        return db.query('DROP TABLE mycube.c' + table);
    };
    SQLService.prototype.addRecord = function (table, geometry) {
        return db.query("INSERT INTO mycube.t" + table + " (geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('" + geometry + "'),4326)) RETURNING id;");
    };
    SQLService.prototype.addAnyRecord = function (schema, table, field, value) {
        return db.query("INSERT INTO " + schema + "." + table + ' ("' + field + '") VALUES (' + value + ") RETURNING id;");
    };
    SQLService.prototype.fixGeometry = function (table) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.fG1(table).then(function (x) {
                console.log(x);
                _this.fG2(table).then(function (y) {
                    console.log(y);
                    _this.fG3(table).then(function (z) {
                        console.log(z);
                        _this.fG4(table).then(function (a) {
                            console.log(a);
                            resolve();
                        });
                    });
                });
            });
        });
        return promise;
    };
    SQLService.prototype.fG1 = function (table) {
        return db.query("ALTER TABLE mycube.t" + table + " ADD geom2d geometry;");
    };
    SQLService.prototype.fG2 = function (table) {
        return db.query("UPDATE mycube.t" + table + " SET geom2d = ST_Force2D(geom);");
    };
    SQLService.prototype.fG3 = function (table) {
        return db.query("ALTER TABLE mycube.t" + table + " DROP geom;");
    };
    SQLService.prototype.fG4 = function (table) {
        return db.query("ALTER TABLE mycube.t" + table + " RENAME geom2d TO geom;");
    };
    SQLService.prototype.fG5 = function (table) {
        return db.query("ALTER TABLE mycube.t" + table + " ALTER COLUMN geom type geometry(Geometry, 4326);");
    };
    SQLService.prototype.deleteRecord = function (table, id) {
        return db.query("DELETE FROM mycube.t" + table + " WHERE id = '" + id + "';");
    };
    SQLService.prototype.deleteAnyRecord = function (schema, table, id) {
        return db.query('DELETE FROM ' + schema + '."' + table + '" WHERE id' + " = '" + id + "';");
    };
    SQLService.prototype.getschema = function (schema, table) {
        return db.query("SELECT cols.column_name AS field, cols.data_type as type,\n        pg_catalog.col_description(c.oid, cols.ordinal_position::int) as description\n        FROM pg_catalog.pg_class c, information_schema.columns cols\n        WHERE cols.table_schema = '" + schema + "' AND cols.table_name = '" + table + "' AND cols.table_name = c.relname");
    };
    SQLService.prototype.getsingle = function (table, id) {
        return db.query("SELECT * FROM " + table + " WHERE id='" + id + "';");
    };
    SQLService.prototype.getanysingle = function (schema, table, field, value) {
        return db.query("SELECT * FROM " + schema + '."' + table + "\" WHERE \"" + field + "\" = " + value);
    };
    SQLService.prototype.getcomments = function (table, id) {
        return db.query('SELECT id, userid, comment, geom, filename, auto, featureid, createdat, users."firstName", users."lastName" FROM mycube.c' + table + "  INNER JOIN users ON mycube.c" + table + '.userid = users."ID" WHERE mycube.c' + table + ".featureid='" + id + "' ORDER BY id DESC;");
        //return db.query("SELECT mycube.c" + table + '.*, users."firstName", users."lastName" FROM mycube.c' + table + "  INNER JOIN users ON mycube.c" + table + '.userid = users."ID" WHERE mycube.c' + table + ".featureid='" + id + "';")
    };
    SQLService.prototype.getSingleLog = function (schema, table, id) {
        return db.query('SELECT ' + schema + '."' + table + '".*, users."firstName", users."lastName" FROM ' + schema + '.' + table + "  INNER JOIN users ON " + schema + "." + table + '.userid = users."ID" WHERE ' + schema + '.' + table + ".featureid='" + id + "' ORDER BY id DESC;");
    };
    SQLService.prototype.addAnyCommentWithoutGeom = function (comment) {
        if (comment.geom) {
            var ntext = /'/g;
            try {
                comment.comment = comment.comment.replace(ntext, "''");
            }
            catch (error) { }
            return db.query("INSERT INTO " + comment.schema + '."' + comment.logTable + '" (userid, comment, geom, featureid, auto) VALUES (' + comment.userid + ",'" + comment.comment + "',(ST_SetSRID(ST_GeomFromGeoJSON('" + JSON.stringify(comment.geom['geometry']) + "'),4326))," + comment.featureid + "," + comment.auto + ")");
        }
        else {
            return db.query("INSERT INTO " + comment.schema + '."' + comment.logTable + '" (userid, comment, featureid, auto) VALUES (' + comment.userid + ",'" + comment.comment + "','" + comment.featureid + "'," + comment.auto + ") RETURNING id;");
        }
    };
    SQLService.prototype.addImage = function (comment) {
        return db.query("UPDATE " + comment['body']['schema'] + '."' + comment['body']['table'] + '"' + " SET file = ?, filename = ? where id ='" + comment['body']['id'] + "'", { replacements: [comment.file.buffer, comment.file.originalname] });
    };
    SQLService.prototype.addAnyImage = function (comment) {
        return db.query('UPDATE ' + comment['body']['table'] + " SET file = ?, filename = ? where id ='" + comment['body']['id'] + "'", { replacements: [comment.file.buffer, comment.file.originalname] });
    };
    SQLService.prototype.getImage = function (table, id) {
        return db.query("SELECT filename, file FROM mycube.c" + table + " WHERE id=" + id);
    };
    SQLService.prototype.getAnyImage = function (schema, table, id) {
        return db.query('SELECT filename, file FROM "' + schema + '"."' + table + '" WHERE id=' + id);
    };
    SQLService.prototype.deleteComment = function (table, id) {
        return db.query("DELETE FROM mycube.c" + table + ' WHERE id=' + id + ";");
    };
    SQLService.prototype.update = function (table, id, field, type, value) {
        switch (type) {
            case "integer": {
                return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = ' + value + " WHERE id='" + id + "';");
            }
            case "double precision": {
                return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = ' + value + " WHERE id='" + id + "';");
            }
            case "text": {
                if (value == null) {
                    return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = NULL WHERE "' + "id='" + id + "';");
                }
                else {
                    return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = ' + "'" + value + "' WHERE " + "id='" + id + "';");
                }
            }
            case "boolean": {
                return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = ' + value + " WHERE id='" + id + "';");
            }
            case "date": {
                if (value) {
                    return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = ' + "'" + value + "' WHERE id='" + id + "';");
                }
                else {
                    return db.query("UPDATE mycube.t" + table + ' SET "' + field + '" = ' + "null WHERE id='" + id + "';");
                }
            }
        }
    };
    SQLService.prototype.updateAnyRecord = function (schema, table, id, field, type, value) {
        switch (type) {
            case "integer": {
                return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = ' + value + " WHERE id='" + id + "';");
            }
            case "double precision": {
                return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = ' + value + " WHERE id='" + id + "';");
            }
            case "character varying":
            case "text": {
                if (value == null) {
                    return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = NULL WHERE "' + "id='" + id + "';");
                }
                else {
                    var ntext = /'/g;
                    try {
                        value = value.replace(ntext, "''");
                    }
                    catch (error) { }
                    return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = ' + "'" + value + "' WHERE " + "id='" + id + "';");
                }
            }
            case "boolean": {
                return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = ' + value + " WHERE id='" + id + "';");
            }
            case "date": {
                if (value) {
                    return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = ' + "'" + value + "' WHERE id='" + id + "';");
                }
                else {
                    return db.query("UPDATE " + schema + "." + table + ' SET "' + field + '" = ' + "null WHERE id='" + id + "';");
                }
            }
        }
    };
    SQLService.prototype.getOID = function (table) {
        return db.query("SELECT attrelid FROM pg_attribute WHERE attrelid = 'mycube.t" + table + "'::regclass;");
    };
    SQLService.prototype.getColumnCount = function (table) {
        return db.query("select count(column_name) from information_schema.columns where table_name='t" + table + "';");
        //return db.query("select count(*) from information_schema.columns where table_name='mycube.t" + table + "';")
    };
    SQLService.prototype.getIsLabel = function (oid, field) {
        return db.query("SELECT col_description(" + oid + "," + field + ");");
    };
    return SQLService;
}());
module.exports = SQLService;

//# sourceMappingURL=../../../source-maps/modules/postGIS_layers/services/sql-service.js.map
