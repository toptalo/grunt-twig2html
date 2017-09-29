/*
 * grunt-twig2html
 * https://github.com/toptalo/twig2html
 *
 * Copyright (c) 2017 Виктор Виктор
 * Licensed under the MIT license.
 */

'use strict';

var Twig = require('twig');
var extend = require('extend');
var chalk = require('chalk');

function isFunction (variableToCheck) {
    return Object.prototype.toString.call(variableToCheck) === '[object Function]';
}

function isArray (variableToCheck) {
    return Object.prototype.toString.call(variableToCheck) === '[object Array]';
}

module.exports = function (grunt) {
    grunt.registerMultiTask('twig2html', 'Render twig templates to html files', function () {
        var options = this.options({
            globals: '',
            extensions: [],
            functions: {},
            filters: {},
            context: {},
            separator: '\n'
        });

        if (!isArray(options.extensions)) {
            grunt.fail.fatal("extensions has to be an array of functions!");
        }

        options.extensions.forEach(function (fn) {
            Twig.extend(fn);
        });

        Object.keys(options.functions).forEach(function (name) {
            var fn = options.functions[name];
            if (!isFunction(fn)) {
                grunt.fail.fatal('"' + name + '" needs to be a function!');
            }
            Twig.extendFunction(name, fn);
        }.bind(this));

        Object.keys(options.filters).forEach(function (name) {
            var fn = options.filters[name];
            if (!isFunction(fn)) {
                grunt.fail.fatal('"' + name + '" needs to be a function!');
            }
            Twig.extendFilter(name, fn);
        }.bind(this));

        var genericContext = {};
        if (options.globals && typeof options.globals === 'string' && grunt.file.exists(options.globals)) {
            try {
                genericContext = extend(genericContext, grunt.file.readJSON(options.globals));
            } catch (error) {
                grunt.fail.fatal(error);
            }
        }

        genericContext = extend(genericContext, options.context);

        this.files.forEach(function (f) {
            var html = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                var templatePath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
                var templateFile = filepath.substr(filepath.lastIndexOf('/') + 1);
                var templateName = templateFile.substr(0, templateFile.lastIndexOf('.')) || templateFile;

                var templateContextFile = templatePath + templateName + '.json';

                var context = genericContext;

                if (grunt.file.exists(templateContextFile)) {
                    context = extend(genericContext, grunt.file.readJSON(templateContextFile));
                }
                try {
                    return Twig.twig({
                        cache: false,
                        async: false,
                        path: filepath
                    }).render(context);
                } catch (error) {
                    grunt.fail.fatal(error);
                }
            }).join(options.separator);

            grunt.file.write(f.dest, html);

            grunt.log.ok('File ' + chalk.cyan(f.dest) + ' created.');
        });
    });
};
