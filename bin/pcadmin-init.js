#!/usr/bin/env node

var program = require('commander');
var chalk = require('chalk');
var ora = require('ora');
var cliCursor = require('cli-cursor');
// var copy = require('copy');
var logger = require("../libs/logger");
var download = require("download-git-repo");
var exists = require('fs').existsSync;
var rm = require('rimraf').sync;
var path = require('path');
var readlineSync = require('readline-sync');


/**
 * Usage.
 */

program
    .usage('<project-name>');

/**
 * Help.
 */

program.on('--help', function () {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ pcadmin init my-project')
    console.log()
})

/**
 * options
 */

program.option('-p --projectName <projectName>', 'projectName');


program.option('-d --directory <directory>', 'project directory');


/**
 * Help.
 */

function help () {
    program.parse(process.argv);       
    // if (program.args.length < 1 && !program.directory) return program.help()
}

help();


/**
 * Padding.
 */

process.on('exit', function () {
    console.log("$ END")
});

/**
 * 初始化参数从命令行获取
 */

 var projectName = program.projectName;

 var tmpDir = program.directory || program.args[0];
 

// copy('./*', 'foo', function(err, files) {
//     files.forEach((n) => {
//         console.log(n.path);
//     });
//     if (err) throw err;
//     // `files` is an array of the files that were copied
// });

// return;
 /**
  * 输入创建参数
  */

projectName = projectName || (readlineSync.question('$ project name: (pcadmin) ') || 'pcadmin');

tmpDir = tmpDir ||  (readlineSync.question('$ directory path: (pcadmin)) ') || 'pcadmin');

logger.log("start download pcadmin template from github");
 
downloadAndGenerate("ksc-fx/pcadmin", path.resolve(process.cwd(),  tmpDir));

var timeDot = setInterval(() => process.stdout.write('..'), 50);

cliCursor.hide();

// 下载
function downloadAndGenerate (template, tmp) {
    // Remove if local template exists
    if (exists(tmp)) rm(tmp)
    download(template, tmp, { clone: true }, function (err) {
        //spinner.stop();
        clearInterval(timeDot);
        cliCursor.show();        
        if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
        console.log();
        logger.success('创建成功: "%s".', tmp);
        logger.log('可切换到工程目录: "cd %s" 创建view.', tmp);
    });
}