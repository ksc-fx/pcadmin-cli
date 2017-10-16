#!/usr/bin/env node

require('commander')
    .version(require('../package').version)
    .usage('<command> [options]')
    .command('init', 'generate a new project from a template')
    .command('view', 'for pcadmin project create a view')
    .command('cinit', 'generate a new component project from a template')
    .parse(process.argv)