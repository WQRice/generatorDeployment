'use strict';
var fs = require('fs-extra');
var caseConvert=require("./CaseConvert");
var datas;
var util = require('util');

var entityMap = {};
var repNameMap = {};

module.exports = function (jpaFile, packageName, appName) {
    datas = [];
    var parseString = require('xml2js').parseString;
    var xml = fs.readFileSync(jpaFile, 'utf-8');
    var jpaRoot = 'jpa:entity-mappings';

    parseString(xml, function (err, result) {

        console.log(util.inspect(result, false, null));

        //get needed data from XML
        for (var i in result[jpaRoot]['jpa:entity']) {
            var className = result[jpaRoot]['jpa:entity'][i]['$']['class'];
            var basic = result[jpaRoot]['jpa:entity'][i]['jpa:attributes'][0]['jpa:basic'];
            var jpaid = result[jpaRoot]['jpa:entity'][i]['jpa:attributes'][0]['jpa:id'][0]['$']['id'];
            var oneToMany = result[jpaRoot]['jpa:entity'][i]['jpa:attributes'][0]['jpa:one-to-many'];
            var oneToOne = result[jpaRoot]['jpa:entity'][i]['jpa:attributes'][0]['jpa:one-to-one'];
            var manyToOne = result[jpaRoot]['jpa:entity'][i]['jpa:attributes'][0]['jpa:many-to-one'];
            var manyToMany = result[jpaRoot]['jpa:entity'][i]['jpa:attributes'][0]['jpa:many-to-many'];
            var entityId = result[jpaRoot]['jpa:entity'][i]['$']['id'];
            var annotations = result[jpaRoot]['jpa:entity'][i]['jpa:annotation'];
            var annoList = [];


            entityMap[entityId] = className;

            for (var j in basic) {
                // console.log(basic[j]['$']['name'] + ' is of type ' + basic[j]['$']['attribute-type']);
            }
            console.log();

            datas.push({
                'PACKAGENAME': packageName,
                'APPNAME': appName,
                'CLASSNAME': className[0].toUpperCase() + className.slice(1),
                'JPAID': jpaid,
                'BASIC': basic,
                'ONETOMANY': oneToMany,
                'ONETOONE': oneToOne,
                'MANYTOONE': manyToOne,
                'MANYTOMANY': manyToMany,
                'ENTITYID': entityId,
                'caseConvert':caseConvert,
            });

             for(var j in annotations) {
                    annoList.push(annotations[j]['$']['n']);
                    if(annotations[j]['$']['n'].substr(0,8) == "@repName"){
                        // console.log(annotations[j]['$']['n'].substr(0,8) );
                        var compoList = annotations[j]['$']['n'].substring(9,annotations[j]['$']['n'].length-1);
                        repNameMap[className[0].toUpperCase() + className.slice(1)] = compoList.split(/,\s*/);
                        // console.log(compoList.split(/,\s*/));

                    }
            }
           

        }

    });

    var mappedBy={};
    var forwardMap={};
    for (var i in datas) {
        mappedBy[datas[i].CLASSNAME]={};
        mappedBy[datas[i].CLASSNAME]['oneByOne']=[];
        mappedBy[datas[i].CLASSNAME]['oneByMany']=[];
        mappedBy[datas[i].CLASSNAME]['manyByOne']=[];
        mappedBy[datas[i].CLASSNAME]['manyByMany']=[];

        forwardMap[datas[i].CLASSNAME]={};
        forwardMap[datas[i].CLASSNAME]['oneToOne']=[];
        forwardMap[datas[i].CLASSNAME]['oneToMany']=[];
        forwardMap[datas[i].CLASSNAME]['manyToOne']=[];
        forwardMap[datas[i].CLASSNAME]['manyToMany']=[];
    }

    for(var i in datas){
        if(datas[i]['ONETOONE']!=undefined){
            for(var k in datas[i]['ONETOONE']){
                mappedBy[entityMap[datas[i]['ONETOONE'][k]['$']['connected-entity-id']]]['oneByOne'].push(datas[i].CLASSNAME);
            forwardMap[datas[i].CLASSNAME]['oneToOne'].push(entityMap[datas[i]['ONETOONE'][k]['$']['connected-entity-id']]);
            }
        }
        if(datas[i]['ONETOMANY']!=undefined){
            for(var k in datas[i]['ONETOMANY']){
                mappedBy[entityMap[datas[i]['ONETOMANY'][k]['$']['connected-entity-id']]]['manyByOne'].push(datas[i].CLASSNAME);
             forwardMap[datas[i].CLASSNAME]['oneToMany'].push(entityMap[datas[i]['ONETOMANY'][k]['$']['connected-entity-id']]);

            }
        }
        if(datas[i]['MANYTOONE']!=undefined){
            for(var k in datas[i]['MANYTOONE']){
                mappedBy[entityMap[datas[i]['MANYTOONE'][k]['$']['connected-entity-id']]]['oneByMany'].push(datas[i].CLASSNAME);
            forwardMap[datas[i].CLASSNAME]['manyToOne'].push(entityMap[datas[i]['MANYTOONE'][k]['$']['connected-entity-id']]);

            }
        }
        if(datas[i]['MANYTOMANY']!=undefined){
            for(var k in datas[i]['MANYTOMANY']){
                mappedBy[entityMap[datas[i]['MANYTOMANY'][k]['$']['connected-entity-id']]]['manyByMany'].push(datas[i].CLASSNAME);
                forwardMap[datas[i].CLASSNAME]['manyToMany'].push(entityMap[datas[i]['MANYTOMANY'][k]['$']['connected-entity-id']]);

            }
        }
    }

    for(var i in datas){
        datas[i]['IdToEntity'] = entityMap;
        datas[i]['mappedBy']=mappedBy;
        datas[i]['forwardMap']=forwardMap;
        datas[i]['REPNAMEMAP'] = repNameMap;
    }

    // console.log(util.inspect(mappedBy, false, null));
    // console.log(util.inspect(datas, false, null));
    // console.log(datas.length);
    return datas;
}