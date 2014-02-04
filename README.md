# grunt-custom-styleguide

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

#### options.process
Type: `Function`
Default value: `false`

If specified the custom_styleguide task will pass all stylesheet rules grouped by stylesheet filename to this function. It allows you to define what rules of your stylesheets you want to process and what should be generated out of this information. See example below.


### Usage Examples

#### Process function example
In this example, the process option is used to create a very basic styleguide. The process option allows advanced customization of processing the stylesheet rules and let's you define what you would like to do with the received data.

```js
// using marked here as an example - marked is a full-featured markdown parser and compiler, written in JavaScript.
var marked = require('marked');

grunt.initConfig(
{
  custom_styleguide:
  {
    options:
    {
      process: function( stylesheets, outputPath )
      {
        var allRules = [];
            
        for ( var sheet in stylesheets )
        {
          allRules = allRules.concat( stylesheets[ sheet ].rules );
        }

        var commentBlocks = [];

        for ( var i = 0; i < allRules.length; i++ )
        {
          var rule = allRules[i];

          switch ( rule.type )
          {
            case "comment":
              // this is just a basic example
              // you could use marked.lexer to parse the comment for headings or code
              commentBlocks.push( '<div class="styleguide-comment">' + marked( rule.comment ) + '</div>' );
              break;
          }
        }

        grunt.file.write( outputPath, commentBlocks.join('\n') );
      }
    },
    files:
    {
      'styleguide.html': [ 'path/to/style.css', 'path/to/advanced-style.css' ],
    },
  },
});
```

## Release History

__0.1.0__

  * Defined custom_styleguide task.