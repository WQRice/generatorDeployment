'use strict';
var fs = require('fs-extra');
var data;
// var util = require('util');

module.exports = function (jpaFile, packageName) {

    var parseString = require('xml2js').parseString;
    var xml = fs.readFileSync('XML/' + jpaFile, 'utf-8');
    var jpaRoot = 'jpa:entity-mappings';

    parseString(xml, function (err, result) {

//     console.log(util.inspect(result, false, null));

        //get needed data from XML
        var className = result[jpaRoot]['jpa:entity'][0]['$']['class'];
        var basic = result[jpaRoot]['jpa:entity'][0]['jpa:attributes'][0]['jpa:basic'];
        var jpaid = result[jpaRoot]['jpa:entity'][0]['jpa:attributes'][0]['jpa:id'][0]['$']['id'];

        for (var j in basic) {
            console.log(basic[j]['$']['name'] + ' is of type ' + basic[j]['$']['attribute-type']);
        }
        console.log();

        data = {
            'PACKAGENAME': packageName,
            'CLASSNAME': className[0].toUpperCase() + className.slice(1),
            'JPAID': jpaid,
            'BASIC': basic
        };

    });

    return data;
}