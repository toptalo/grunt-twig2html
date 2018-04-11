/*
 * grunt-twig2html
 * https://github.com/toptalo/twig2html
 *
 * Copyright (c) 2018 Виктор Виктор
 * Licensed under the MIT license.
 */

'use strict';

const Twig = require('twig');
const extend = require('extend');
const chalk = require('chalk');

module.exports = (grunt) => {
    grunt.registerMultiTask('twig2html', 'Render twig templates to html files', function () {
        const done = this.async();
        const options = this.options({
            globals: '',
            extensions: [],
            functions: {},
            filters: {},
            context: {},
            separator: '\n'
        });

        if (!Array.isArray(options.extensions)) {
            grunt.fail.fatal("extensions has to be an array of functions!");
        }

        options.extensions.forEach(function (fn) {
            Twig.extend(fn);
        });

        Object.keys(options.functions).forEach(name => {
            let fn = options.functions[name];
            if (typeof fn !== 'function') {
                grunt.fail.fatal(`${name} needs to be a function!`);
            }
            Twig.extendFunction(name, fn);
        });

        Object.keys(options.filters).forEach(name => {
            let fn = options.filters[name];
            if (typeof fn !== 'function') {
                grunt.fail.fatal(`${name} needs to be a function!`);
            }
            Twig.extendFilter(name, fn);
        });

        let genericContext = {};
        if (options.globals && typeof options.globals === 'string' && grunt.file.exists(options.globals)) {
            try {
                genericContext = extend(genericContext, grunt.file.readJSON(options.globals));
            } catch (error) {
                grunt.fail.fatal(error);
            }
        }

        genericContext = extend(genericContext, options.context);

        Promise.all(this.files.map((file) => {
            return new Promise((resolveMain, rejectMain) => {
                Promise.all(file.src.filter((filePath) => {
                    if (!grunt.file.exists(filePath)) {
                        grunt.log.warn(`Source file ${filePath} not found.`);
                        return false;
                    } else {
                        return true;
                    }
                }).map((filePath) => {
                    return new Promise((resolveFile, rejectFile) => {
                        let templatePath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let templateFile = filePath.substr(filePath.lastIndexOf('/') + 1);
                        let templateName = templateFile.substr(0, templateFile.lastIndexOf('.')) || templateFile;
                        let templateContextFile = `${templatePath}${templateName}.json`;
                        let context = genericContext;

                        if (grunt.file.exists(templateContextFile)) {
                            context = extend(genericContext, grunt.file.readJSON(templateContextFile));
                        }

                        try {
                            let output = Twig.twig({
                                cache: false,
                                async: false,
                                path: filePath
                            }).render(context);

                            resolveFile(output);
                        } catch (error) {
                            rejectFile(error);
                        }
                    });
                })).then((result) => {
                    let contents = result.join(options.separator);
                    grunt.file.write(file.dest, contents);
                    grunt.log.ok(`File ${chalk.cyan(file.dest)} created.`);
                    resolveMain();
                }).catch((error) => {
                    rejectMain(error);
                    grunt.fail.fatal(error);
                });
            });
        })).then((result) => {
            done(result);
        }).catch((error) => {
            grunt.fail.fatal(error);
        });
    });
};
