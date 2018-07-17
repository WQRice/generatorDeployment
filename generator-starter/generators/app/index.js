var p2j=require('../../module/parse2Java');
var p2f=require('../../module/parse2Front');
var parser = require('../../module/XMLMultiEntityParser');
var fs= require('fs-extra');
var Generator = require('yeoman-generator');
var fuzzy = require('fuzzy');

var jpaList;
var buildLater='No';

function searchJpas(answers, input) {
    // console.log('I am called');
    input = input || '';
    return new Promise(function(resolve) {
        setTimeout(function() {
            var fuzzyResult = fuzzy.filter(input, jpaList);
            resolve(fuzzyResult.map(function(el) {
                return el.original;
            }));
        }, Math.floor(Math.random()*500+30));
    });
}

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag

        //remove previous Sample folder
        fs.removeSync('XML/.DS_Store');
        jpaList=fs.readdirSync('XML');
        this.env.adapter.promptModule.registerPrompt('autoComplete', require('inquirer-autocomplete-prompt'));
//     this.log(jpaList);
    }


    prompting() {
        return this.prompt([{
            type    : 'autoComplete',
            name    : 'jpaFile',
            message : 'Choose your jpaFile:',
            source  :  searchJpas
        }, {
            type    : 'input',
            name    : 'packageName',
            message : 'Your package name:',
            default : 'sample', // Default to current folder name
            store   : true
        }, {
            type    : 'list',
            name    : 'executeLater',
            message : 'Would you like to run the application after finishing generation?',
            choices : ['Yes','No'],
            store   : true
        }]).then((answers) => {
            fs.removeSync('Sample');
        fs.copySync('webStatic', 'Sample');
        var datas = parser(answers.jpaFile,answers.packageName);
        p2j(datas);
        p2f(datas);
        buildLater=answers.executeLater;
    });
    }

    end(){
        if(buildLater=='Yes'){
            var gradleBuild=require('../../module/gradleBuild');
            //This might only be used in MAC/Linux system. Build and run the generated application
            gradleBuild(this);
        }
    }

};