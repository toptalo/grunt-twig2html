[![Build Status](https://travis-ci.org/toptalo/grunt-twig2html.svg?branch=master)](https://travis-ci.org/toptalo/grunt-twig2html)

# grunt-twig2html

Grunt plugin that compile twig templates to html pages.

Build upon [Twig.js](https://github.com/twigjs/twig.js), the JS port of the Twig templating language by John Roepke.

## Getting Started
This plugin requires Grunt `^1.0.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-twig2html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-twig2html');
```

## The "twig2html" task

### Overview
In your project's Gruntfile, add a section named `twig2html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  twig2html: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
});
```

### Options

#### options.globals
Type: `String`
Default value: `''`

Path to JSON file with global context variables.

#### options.extensions
Type: `Array`
Default value: `[]`

Can be an array of functions that extend TwigJS with [custom tags](https://github.com/twigjs/twig.js/wiki/Extending-twig.js-With-Custom-Tags).

#### options.functions
Type: `Object`
Default value: `{}`

Object hash defining [functions in TwigJS](https://github.com/twigjs/twig.js/wiki/Extending-twig.js#functions).

#### options.filters
Type: `Object`
Default value: `{}`

Object hash defining [filters in TwigJS](https://github.com/twigjs/twig.js/wiki/Extending-twig.js#filters).

#### options.context
Type: `Object`
Default value: `{}`

Object hash defining templates context variables.

#### options.separator
Type: `String`
Default value: `'\n'`

A string that is inserted between each compiled template when concatenating templates.

### Usage Examples

```js
grunt.initConfig({
    twig2html: {
        options: {
            context: {}, // task specific context object hash
            globals: 'path/to/globals.json'
        },
        target: {
            options: {
                context: {} // target specific context object hash
            },
            files: [
                {
                    expand: true,
                    cwd: 'path/to/pages',
                    src: ['**/*.twig'],
                    dest: 'path/to/dest/',
                    ext: '.html'
                }
            ]
        }
    }
});
```

#### Context hierarchy

Template context extends in this order:
* `options.globals` or `target.options.globals` if provided
* `options.context` or `target.options.context` if provided
* template JSON context files (stored in template path, with same name,
example: `/templates/index.json` for `/templates/index.twig`) if provided

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Sponsored by

[![DesignDepot](https://designdepot.ru/static/core/img/logo.png)](https://designdepot.ru/?utm_source=web&utm_medium=npm&utm_campaign=grunt-twig2html)

## Release History
See the [CHANGELOG](CHANGELOG.md).
