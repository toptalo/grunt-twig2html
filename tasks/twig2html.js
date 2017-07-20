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

// http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
function isFunction (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function isArray (variableToCheck) {
    return Object.prototype.toString.call(variableToCheck) === '[object Array]';
}

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('twig2html', 'Render twig templates to html files', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            globals: '',
            extensions: [],
            functions: {},
            filters: {},
            context: {},
            separator: '\n'
        });

        // extending Twig

// validate type of extensions
        if (false === isArray(options.extensions)) {
            grunt.fail.fatal("extensions has to be an array of functions!");
        }

        // apply defined extensions
        options.extensions.forEach(function (fn) {
            Twig.extend(fn);
        });

        // apply defined functions
        Object.keys(options.functions).forEach(function (name) {
            var fn = options.functions[name];
            if (!isFunction(fn)) {
                grunt.fail.fatal('"' + name + '" needs to be a function!');
            }
            Twig.extendFunction(name, fn);
        }.bind(this));

        // apply defined filters
        Object.keys(options.filters).forEach(function (name) {
            var fn = options.filters[name];
            if (!isFunction(fn)) {
                grunt.fail.fatal('"' + name + '" needs to be a function!');
            }
            Twig.extendFilter(name, fn);
        }.bind(this));

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            var html = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
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

                var context = extend({}, options.context);

                if (options.globals && typeof options.globals === 'string' && grunt.file.exists(options.globals)) {
                    try {
                        context.globals = grunt.file.readJSON(options.globals);
                    } catch (error) {
                        grunt.fail.fatal(error);
                    }
                }

                var templateContextFile = templatePath + templateName + '.json';

                if (grunt.file.exists(templateContextFile)) {
                    context.page = grunt.file.readJSON(templateContextFile);
                }

                return Twig.twig({
                    cache: false,
                    async: false,
                    path: filepath
                }).render(context);
            }).join(options.separator);

            // Write the destination file.
            grunt.file.write(f.dest, html);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
