var p2j=require('../../module/parse2Java');
var p2f=require('../../module/parse2Front');
var parser = require('../../module/XMLMultiEntityParser');
var fs= require('fs-extra');
var Generator = require('yeoman-generator');
var fuzzy = require('fuzzy');

var jpaList=[];
var XMLPath;
var outputPath;
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

        this.env.adapter.promptModule.registerPrompt('autoComplete', require('inquirer-autocomplete-prompt'));
//     this.log(jpaList);
    }

    initializing() {
        return this.prompt([{
            type    : 'input',
            name    : 'XMLPath',
            message : 'What is the path of your XML files directory:',
            default : '.', // Default to current folder
            store   : true
        }]).then((answers) => {
            XMLPath=answers.XMLPath.trim();
            var tempList=fs.readdirSync(XMLPath);
            for(var i in tempList){
                if(tempList[i].split('.').slice(-1)[0]=='jpa'){
                    jpaList.push(tempList[i]);
                }
            }
    });
    }

    prompting() {
        return this.prompt([{
            type    : 'input',
            name    : 'applicationName',
            message : 'Your application name:',
            default : 'OwlsWeb', // Default to current folder name
            store   : true
        }, {
            type    : 'input',
            name    : 'packageName',
            message : 'Your package name:',
            default : 'sample', // Default to current folder name
            store   : true
        },{
            type    : 'autoComplete',
            name    : 'jpaFile',
            message : 'Choose your jpaFile:',
            source  :  searchJpas
        },{
            type    : 'list',
            name    : 'executeLater',
            message : 'Would you like to run the application after finishing generation?',
            choices : ['Yes','No'],
            store   : true
        }]).then((answers) => {
            outputPath=answers.applicationName;
            fs.removeSync(outputPath);
            fs.copySync('webStatic', outputPath);
            var datas = parser(XMLPath+'/'+answers.jpaFile,answers.packageName,answers.applicationName);
            p2j(datas,outputPath);
            p2f(datas,outputPath);
            buildLater=answers.executeLater;
    });
    }

    end(){
        if(buildLater=='Yes'){
            var gradleBuild=require('../../module/gradleBuild');
            //This might only be used in MAC/Linux system. Build and run the generated application
            gradleBuild(this,outputPath);
        }
    }

};