'use strict';
var ejs = require('ejs');
var fs = require('fs-extra');
var caseConvert=require("./CaseConvert");

module.exports = function (datas) {

    for (var i in datas) {
        //produce controller
        var template = fs.readFileSync('backendTemplate/controller.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync("Sample/src/main/java/OITWeb/" + datas[i].PACKAGENAME + "/controller/" + datas[i].CLASSNAME + 'Controller.java', file, 'utf8');

        //produce entity class
        var template = fs.readFileSync('backendTemplate/entity.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync("Sample/src/main/java/OITWeb/" + datas[i].PACKAGENAME + "/model/" + datas[i].CLASSNAME + '.java', file, 'utf8');

        //produce repository class
        var template = fs.readFileSync('backendTemplate/repository.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync("Sample/src/main/java/OITWeb/" + datas[i].PACKAGENAME + "/repository/" + datas[i].CLASSNAME + 'Repository.java', file, 'utf8');
    }


    if (datas.length > 0) {
        //produce exception class
        var template = fs.readFileSync('backendTemplate/exception.ejs', 'utf-8');
        var file = ejs.render(template, datas[0]);
        fs.outputFileSync("Sample/src/main/java/OITWeb/" + datas[0].PACKAGENAME + "/exception/" + 'ResourceNotFoundException.java', file, 'utf8');

        //produce entry class
        var template = fs.readFileSync('backendTemplate/application.ejs', 'utf-8');
        var file = ejs.render(template, datas[0]);
        fs.outputFileSync("Sample/src/main/java/OITWeb/" + caseConvert.upFirst(datas[0].PACKAGENAME)+ 'Application.java', file, 'utf8');

        var template = fs.readFileSync('backendTemplate/repositoryAdapter.ejs', 'utf-8');
        var file = ejs.render(template, datas[0]);
        fs.outputFileSync("Sample/src/main/java/OITWeb/" + datas[0].PACKAGENAME + "/repository/" + 'RepositoryAdapter.java', file, 'utf8');
    }
}