module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nwjs: {
            options: {
                platforms: ['win', 'osx64', 'linux'],
                buildDir: './build',
                version: 'v0.12.3'
            },
            src: ['./**']
        }

    });

// 3. Where we tell Grunt we plan to use this plug-in.

    grunt.loadNpmTasks('grunt-nw-builder');

// 4. Where we tell Grunt what to do when we type 'grunt' into the terminal.

    grunt.registerTask('build', ['nwjs']);

};
