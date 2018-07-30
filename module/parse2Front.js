'use strict';
var ejs = require('ejs');
var fs = require('fs-extra');
var util = require('util');

// var parser = require('./XMLParser');

module.exports = function (datas, outputPath, modulePath) {

    var datasobj = {'dataArray': datas};

    // console.log(util.inspect(datas, false, null));

    var template = fs.readFileSync(modulePath + '/frontendTemplate/index_html_template.ejs', 'utf-8');
    var file = ejs.render(template, datasobj);
    fs.outputFileSync(outputPath + "/src/main/resources/static/index.html", file, 'utf8');

    var template = fs.readFileSync(modulePath + '/frontendTemplate/appController_js_template.ejs', 'utf-8');
    var file = ejs.render(template, datasobj);
    fs.outputFileSync(outputPath + "/src/main/resources/static/js/appController.js", file, 'utf8');


    for (var i in datas) {
        var template = fs.readFileSync(modulePath + '/frontendTemplate/view_html_template.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync(outputPath + "/src/main/resources/static/js/views/" + datas[i].CLASSNAME + ".html", file, 'utf8');

        var template = fs.readFileSync(modulePath + '/frontendTemplate/viewModel_js_template.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync(outputPath + "/src/main/resources/static/js/viewModels/" + datas[i].CLASSNAME + ".js", file, 'utf8');

        var template = fs.readFileSync(modulePath + '/frontendTemplate/add_View_html_template.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync(outputPath + "/src/main/resources/static/js/views/Add" + datas[i].CLASSNAME + ".html", file, 'utf8');

        var template = fs.readFileSync(modulePath + '/frontendTemplate/edit_View_html_template.ejs', 'utf-8');
        var file = ejs.render(template, datas[i]);
        fs.outputFileSync(outputPath + "/src/main/resources/static/js/views/Edit" + datas[i].CLASSNAME + ".html", file, 'utf8');

        var template = fs.readFileSync(modulePath + '/frontendTemplate/add_viewModel_js_template.ejs', 'utf-8');
        var file = ejs.render(template, {myself: datas[i], 'dataArray': datas});
        fs.outputFileSync(outputPath + "/src/main/resources/static/js/viewModels/Add" + datas[i].CLASSNAME + ".js", file, 'utf8');

        var template = fs.readFileSync(modulePath + '/frontendTemplate/edit_viewModel_js_template.ejs', 'utf-8');
        var file = ejs.render(template, {myself: datas[i], 'dataArray': datas});
        fs.outputFileSync(outputPath + "/src/main/resources/static/js/viewModels/Edit" + datas[i].CLASSNAME + ".js", file, 'utf8');


    }

}