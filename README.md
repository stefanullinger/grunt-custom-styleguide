# grunt-custom-styleguide

[![Build Status](https://travis-ci.org/sullinger/grunt-custom-styleguide.png?branch=master)](https://travis-ci.org/sullinger/grunt-custom-styleguide)
[![NPM version](https://badge.fury.io/js/grunt-custom-styleguide.png)](http://badge.fury.io/js/grunt-custom-styleguide)

> Creates a custom styleguide from (commented) CSS files.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-custom-styleguide --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-custom-styleguide');
```

## The "custom_styleguide" task

### Overview
In your project's Gruntfile, add a section named `custom_styleguide` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  custom_styleguide: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.processor
Type: `String` or `Object`
Default value: `markdown`

Specifies the processer to use. Either provide a string matching the name of one of the registered processors (currently the only built-in processor is 'markdown') or provide a javascript object. In this object you can either define your own `process` function and any helper function you like or override functions of built-in processors (use in conjunction with `inheritFromBuiltInProcessor` option). See examples below.

#### options.inheritFromBuiltInProcessor
Type: `String`
Default value: ``

Name of one of the built-in processors that should be extended by the object you provided using the `processor` option.


### Usage Examples

#### Markdown processor example
Basic example demonstrating the use of build-in processors.

```js

grunt.initConfig(
{
  custom_styleguide:
  {
    options:
    {
      processor: 'markdown'
    },
    files:
    {
      'styleguide.html': [ 'path/to/style.css', 'path/to/advanced-style.css' ],
    },
  },
});
```

#### Custom processor example
In this example, a custom processor is provided to the task. This gives you full control on how your styleguide is generated. If you think that other might be interested in your styleguide processor, please create a pull request.

```js

grunt.initConfig(
{
  custom_styleguide:
  {
    options:
    {
      processor:
      {
        process: function(stylesheets, outputPath)
        {
          // stylesheets is an object. Each key-value pair consists of
          // the stylesheet filename (key) and the an array of all rules (value)
          // found in the stylesheet file.

          var rules = this.getRulesFromStylesheets(stylesheets);

          // you can do any kind of processing and file handling here
          grunt.file.write(outputFile, JSON.stringify(rules, null, 2));
        },

        getRulesFromStylesheets: function(stylesheets)
        {
          var allRules = [];

          // grab all rules from the stylesheets
          for (var sheet in stylesheets)
          {
            var rules = stylesheets[sheet].rules;

            rules = rules.map(function(rule)
            {
              rule.stylesheet = sheet;
              return rule;
            });

            allRules = allRules.concat(rules);
          }

          return allRules;
        }

      },
      inheritFromBuiltInProcessor: 'markdown'
    },
    files:
    {
      'styleguide.html': [ 'path/to/style.css', 'path/to/advanced-style.css' ],
    },
  },
});
```

**Note:** I will add more examples shortly.


## Release History

**Note:** Still under active development with no official release, use at your own risk.

__0.2.0__

  * Refactored custom_styleguide task to make it as flexible as possible. You can now use built-in processors, extend them partially or provide your own.

__0.1.0__

  * Defined custom_styleguide task.