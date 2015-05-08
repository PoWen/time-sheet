var shell = require('shelljs');

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + month +  day + hour + min + sec;

}

//backup db dictionary
var backupName = getDateTime() + '.7z';
var compressCmd = '7z a backup/' + backupName + ' db/*.*';
shell.echo("Now is running: " + compressCmd);
shell.cd('data');
shell.exec(compressCmd); //default async is false. Should not compress data and open db at the same time
shell.cd('../');

//run db
var dbOpenCmd = 'npm run db'; //start cmd /k 
//shell.echo("Now is running: " + dbOpenCmd); 
shell.exec(dbOpenCmd, {async:true});

//run node server
var nodeServerOpenCmd = 'npm run start'; //start cmd /k 
shell.exec(nodeServerOpenCmd, {async:true});
//shell.echo("Server have run.");

