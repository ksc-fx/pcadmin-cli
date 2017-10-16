#!/usr/bin/env node

var program = require('commander');
var chalk = require('chalk');
var cliCursor = require('cli-cursor');
var logger = require("../libs/logger");
var fs = require('fs');
var exists = fs.existsSync;
var path = require('path');
var readlineSync = require('readline-sync');
var copy = require('../libs/copy');


/**
 * view var
 */

var projectRootPath = process.cwd();
var viewTemplatePath = path.resolve(path.dirname(__dirname), './view_template/');
var projectViewPath =  path.resolve(projectRootPath, './client/views/');
var projectMenuPath =  path.resolve(projectRootPath, './client/store/menu/');

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
    console.log(chalk.gray('    # create a view'))
    console.log('    $ pcadmin view <view-name>')
    console.log()
})

/**
 * options
 */

program.option('-p --viewParentName <viewParentName>', 'viewParentName');

/**
 * Help.
 */

function help () {
    // @todo 验证工程
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

 var viewParentName = program.viewParentName;


 /**
  * 输入创建参数
  */

viewParentName = viewParentName || (readlineSync.question('$ view的父级名字(为空侧是顶层): ') || '');

hasPath = readlineSync.question('$ 是否可链接(默认为yes): ') === 'no'? false : true;

viewName = (readlineSync.question('$ view 的名字 : '));

if (!viewName) {
    logger.fatal('view 的名字是必须的');
}


/**
 * 创建view
 */
var source = viewTemplatePath + '/index.vue';

if (viewParentName) {
    copy(source, projectViewPath + '/' + viewParentName + '/' + viewName + '/index.vue', {
        '<view-name>': viewName
    });
}
else {
    copy(source, projectViewPath + '/' + viewName + '/index.vue', {
        '<view-name>': viewName
    });
}

/**
 * 创建menu
 */

var menuDataPath = projectMenuPath + '/data.js';

let menuDataContent = fs.readFileSync(menuDataPath, 'utf8');

menuDataContent = menuDataContent.replace(/import/g, '$import');

var menuData =  eval(menuDataContent);
var parseMenuData = {};

var parseMenu = function(meunData) {
    meunData.forEach(function(v) {
        parseMenuData[v.name] = v;
        if (v.children) {
            parseMenu(v.children);
        }            
    });
}
parseMenu(menuData);

var newMenu = {
    name: viewName,
    path: '/' + viewName,
    component: function () {
        return $import('../../views/<view-name>/index.vue')
    },
    meta: {
    }
}
if (viewParentName) {
    newMenu = {
        name: viewName,
        path: '/' + viewParentName + '/' + viewName,
        component: function () {
            return $import('../../views/<view-parent-name>/<view-name>/index.vue')
        },
        meta: {
        }
    }
    parseMenuData[viewParentName].children = parseMenuData[viewParentName].children || [];
    parseMenuData[viewParentName].children.push(newMenu);
}
else {
    menuData.push(newMenu);    
}

if(!hasPath){
    delete newMenu.path
}

var menuDataString = JSON.stringify(menuData, function(k, v) {
    if(typeof v === 'function') {
        return (v + '')
        .replace(/\n/g, '')
        .replace('<view-name>', viewName)
        .replace('<view-parent-name>', viewParentName);
    }
    return v;
}, 4);

menuDataString = menuDataString.replace(/\"function/g, 'function');
menuDataString = menuDataString.replace(/\}"/g, '}');
menuDataString = menuDataString.replace(/\$import/g, 'import');

var newMeunDataString = ['var data =', menuDataString, '\n', 'module.exports = data'];

fs.writeFileSync(projectMenuPath + '/data.js', newMeunDataString.join(''));

logger.success('create menu is ok');