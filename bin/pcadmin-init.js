#!/usr/bin/env node

var program = require('commander');
var chalk = require('chalk');
var ora = require('ora');
var logger = require("../libs/logger");
var download = require("download-git-repo");
var exists = require('fs').existsSync;
var rm = require('rimraf').sync;
var path = require('path');




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
 * Help.
 */

function help () {
    program.parse(process.argv);
    if (program.args.length < 1) return program.help()
}

help();
/**
 * Padding.
 */

process.on('exit', function () {
    console.log("      $ END")
});



downloadAndGenerate("ksc-fx/pcadmin", path.resolve(process.cwd(),  program.args[0]));

// 下载
function downloadAndGenerate (template, tmp) {
    var spinner = ora('downloading template')
    spinner.start()
    // Remove if local template exists
    if (exists(tmp)) rm(tmp)
    download(template, tmp, { clone: true }, function (err) {
        spinner.stop()
        if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
        logger.success('创建成功: "%s".', tmp);
    })
}