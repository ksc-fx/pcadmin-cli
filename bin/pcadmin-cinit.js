#!/usr/bin/env node

const download = require('download-git-repo')
const program = require('commander')
const exists = require('fs').existsSync
const path = require('path')
const ora = require('ora')
const home = require('user-home')
const chalk = require('chalk')
const readlineSync = require('readline-sync');
const inquirer = require('inquirer')
const rm = require('rimraf').sync
const logger = require('../libs/logger')
const generate = require('../libs/generate')

/**
 * Usage.
 */

program
    .usage('<template-name> [project-name]')
    // .option('-p --projectName <projectName>', 'projectName')

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
  program.parse(process.argv)
}
help()

/**
 * Settings.
 */

// let projectName = program.projectName;
let projectName = program.args[0];
projectName = projectName || (readlineSync.question('$ project name: (pcadmin-compontent) ') || 'pcadmin-compontent');
const tmp = path.join(home, '.pcadmin-compontent-templates')
const to = path.resolve(projectName || '.')

/**
 * Padding.
 */

console.log()
process.on('exit', () => {
  console.log()
})
if (exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(logger.fatal)
} else {
  run()
}
/**
 * Check, download and generate the project.
 */

function run () {
    downloadAndGenerate('ksc-fx/pcadmin-c-cli-template-webpack', tmp)
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate (template, tmp) {
  const spinner = ora('downloading template')
  spinner.start()
  // Remove if local template exists
  if (exists(tmp)) rm(tmp)
  download(template, tmp, { clone: true }, err => {
    spinner.stop()
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    generate(projectName, tmp, to, err => {
      if (err) logger.fatal(err)
      console.log()
      logger.success('创建成功 "%s".', projectName)
      if (exists(tmp)) rm(tmp)
    })
  })
}
