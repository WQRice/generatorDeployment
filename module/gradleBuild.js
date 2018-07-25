'use strict';
const { exec } = require('child_process');

module.exports = function (yeoEntity) {
    //execute cmd
    var cmd=exec('cd Sample && ./gradlew build && ./gradlew bootRun');
    var chalk = require('chalk');

    //show build and run information from gradle in real time
    cmd.stdout.on('data', (data) => {
            process.stdout.write(`${data}`);
        });

    yeoEntity.log(chalk.bold.green("\nStop application by entering 'exit'.\n"));
    var stdin = process.stdin;
    stdin.setEncoding( 'utf8' );
    stdin.setRawMode=true;
    stdin.resume();
    //waiting for input command
    stdin.on( 'data', function( key )
    {
        if(key=='exit\n'){
            //using gradle -stop to stop daemon
            exec('./gradlew -stop',function (error, stdout, stderr) {
                console.log(stdout);
                process.exit();
            });
        }else{
            yeoEntity.log(chalk.bold.green("Stop application by entering 'exit'."));
        }
    });
}