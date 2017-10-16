const mkdirp = require('mkdirp')
var fs = require('fs');
var logger = require('./logger');
var path = require('path');

/**
 * Evaluate an expression in meta.json in the context of
 * prompt answers data.
 */

module.exports = function copy(source, target, replace) {
    
    replace = replace || {};

    //if target file is exist, ignore it
    if (fs.existsSync(target)) {
        logger.fatal('target file is exist');
        return;
    }

    //if source file is not exist
    if (!fs.existsSync(source)) {
        logger.fatal('source file is not exist');
        return;
    }

    mkdirp(path.dirname(target));

    let content = fs.readFileSync(source, 'utf8');

    for (let key in replace) {
        while (1) {
            let content1 = content.replace(key, replace[key]);
            if (content1 === content) {
                content = content1;
                break;
            }
            content = content1;
        }
    }

    fs.writeFileSync(target, content);
    
    logger.success('copy source to target is ok: "%s"', target);
}
