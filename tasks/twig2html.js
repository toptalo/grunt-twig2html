/*
 * grunt-twig2html
 * https://github.com/toptalo/twig2html
 *
 * Copyright (c) 2019 Виктор Виктор
 * Licensed under the MIT license.
 */

'use strict';

const TwigRenderer = require('@toptalo/twig-renderer');

module.exports = (grunt) => {
    grunt.registerMultiTask('twig2html', 'Render twig templates to html files', function () {
        const done = this.async();
        const options = this.options({
            separator: '\n'
        });

        const twigRenderer = new TwigRenderer(options);

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
                        twigRenderer.render(filePath).then(html => {
                            resolveFile(html);
                        }).catch(error => {
                            rejectMain(error);
                            grunt.fail.fatal(error);
                        });
                    });
                })).then((result) => {
                    let contents = result.join(options.separator);
                    grunt.file.write(file.dest, contents);
                    grunt.log.ok('File ' + (file.dest).cyan + ' created.');
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
