'use strict';

var Mustache = require("mustache");
var _ = require('lodash');

/**
 * file config 설정
 * ./markup/sass/*.sass =>>> ./markup/dist/css/asset/css/*.css
 */
var path = require('path');
var fs = require('fs');

var fileArr = fs.readdirSync(path.resolve(__dirname, './markup/sass'));
var sassFileConfig = {};
var minFileConfig = {};

fileArr.forEach(function(filename){
    if(filename.match(/\.scss$/)){
        var name = filename.replace(/\.scss$/, '');
        var cssDist = '<%= PUBLIC_DIR %>/css/'+ name + '.css';
        sassFileConfig[cssDist] = './markup/sass/' + name + '.scss';
        minFileConfig[cssDist] = [
            './markup/sass/common/_dummy_charset.scss',
            '<%= PUBLIC_DIR %>/css/' + name + '.css'
        ];
    }
});

module.exports = function (grunt) {
    // load grunt plugins
    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith',
        includereplace: 'grunt-include-replace',
        stringreplace:'grunt-string-replace'
    });

    // Display the elapsed execution time of grunt tasks
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // STATIC_DIR
        PUBLIC_DIR: './markup/dist/assets',
        BASE_DIR  : "",
        HTML_DIR  : "./markup/html",
        BUILD_DIR : "./markup/dist/html",
        IMG_DIR : "./markup/dist/assets/images",
        // Metadata.
        pkg: grunt.file.readJSON("package.json"),
        banner: '/*!  <%= pkg.title || pkg.name %> - v<%= pkg.version %> ' + grunt.util.linefeed + '<%= pkg.author.name %>' + grunt.util.linefeed + ' */' + grunt.util.linefeed,

        // Task configuration.
        clean: {
            options: {
                force: true
            },
            public: [
                '<%= PUBLIC_DIR %>/images',
                '<%= PUBLIC_DIR %>/css/**/*'
            ],
            html_build: [
                '<%= BUILD_DIR %>'
            ]
        },

        includereplace: {
            html: {
                options: {
                    includesDir: '<%= HTML_DIR %>/include/',
                    docroot: '../'
                },
                expand: true,
                cwd: '<%= HTML_DIR %>/',
                src: ['**/*.html'],
                dest: '<%= BUILD_DIR %>/'
            }
        },

        markupfileindex: {
            options: {
                show_date : true,
                filename: 'index.html',
                title:'NEUROGAZER 템플릿 산출물',
                include_folder : ['includes', 'inc', 'testInc'],
                file_sort : 'asc',
                file_sort_key : 'title',
                group_sort : 'asc'
            },
            index: {
                files: [{
                    expand : true,
                    cwd : '<%= BUILD_DIR %>',
                    src: ['**/*.html', '!**/node_modules/**', '!**/.*/**'],
                    dest: '<%= BUILD_DIR %>'
                }]
            }
        },
        sprite: {
            spr_img: {
                src: ['./markup/img/spr_img/*.png'],
                dest: '<%= IMG_DIR %>/spr_img/spr_img.png',
                imgPath: '../images/spr_img/spr_img.png',
                destCss: './markup/sass/sprites/_spr_img.scss',
                padding: 4,
                cssSpritesheetName: 'spr_img'
            },

            spr_img_2x: {
                src: ['./markup/img/spr_img/2x/*.png'],
                dest: '<%= IMG_DIR %>/spr_img/spr_img_2x.png',
                imgPath: '../images/spr_img/spr_img_2x.png',
                destCss: './markup/sass/sprites/_spr_img_2x.scss',
                padding: 4,
                cssSpritesheetName: 'spr_img_2x'
            },
            spr_spot_img: {
                src: ['./markup/img/spot/*.png'],
                dest: '<%= IMG_DIR %>/spot/spr_spot_img.png',
                imgPath: '../images/spot/spr_spot_img.png',
                destCss: './markup/sass/sprites/_spr_spot_img.scss',
                padding: 4,
                cssSpritesheetName: 'spr_spot_img'
            },

            spr_spot_img_2x: {
                src: ['./markup/img/spot/2x/*.png'],
                dest: '<%= IMG_DIR %>/spot/spr_spot_img_2x.png',
                imgPath: '../images/spot/spr_spot_img_2x.png',
                destCss: './markup/sass/sprites/_spr_spot_img_2x.scss',
                padding: 4,
                cssSpritesheetName: 'spr_spot_img_2x'
            },
        },

        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: !grunt.option('no-map')
            },

            pc: {
                files: sassFileConfig
            }
        },

        postcss: {
            options: {
                map: !grunt.option('no-map'),
                processors: [
                    require('autoprefixer')(),
                    require("css-mqpacker")()
                ],
                browsers: ['last 2 versions','Android']
            },

            pc: {
                src:
                    [
                        '<%= PUBLIC_DIR %>/css/**/*.css'
                    ]
            }
        },

        cssmin: {
            options: {
                advanced: true,
                aggressiveMerging: false,
                compatibility: 'ie9',
                keepSpecialComments: 0,
                mediaMerging: false,
                restructuring: false,
                shorthandCompacting: false,
                sourceMap: !grunt.option('no-map')
            },

            pc: {
                files: minFileConfig
            }
        },

        copy: {
            static_resource: {
                files: [{
                    expand: true,
                    cwd: './markup/img',
                    src: [
                        '**/*',
                        '!**/spr_*.png',
                        '!**/spr_*/**',
                        '!**/spr_*/**/*.png',
                        '!**/spot/**',
                        '!**/spot/**/*.png'
                    ],
                    dest: 'markup/dist/assets/images'
                }]
            }
        },

        sync: {

            dist: {
                verbose: true,
                files: [{
                    cwd: 'markup/dist',
                    src: ['**'],
                    dest: 'markup/dist'
                }]
            },
            image: {
                verbose: true,
                files: [{
                    cwd: 'markup/img',
                    src: [
                        '**/*.png',
                        '!**/spr_*.png',
                        '!**/spr_*/**/*.png'
                    ],
                    dest: 'markup/dist/assets/images'
                }]
            }
        },

        watch: {
            options: {
                interrupt: true
                // reload: true
            },

            gruntfileReload: {
                options: {
                    reload: true
                },
                files: ['Gruntfile.js']
            },

            livereload: {
                options: {
                    livereload: true,
                    interrupt: true
                },
                files: ['<%= PUBLIC_DIR %>/css/**/*.css','<%= BUILD_DIR %>/**/*.html']
            },

            html: {
                files: ['./markup/html/**/*.html'],
                tasks: ['includereplace', 'sync']
            },

            common_sass: {
                files: ['./markup/sass/**/*.scss'],
                tasks: ['build_sass', 'copy:static_resource', 'sync']
            },
            sprite: {
                files: ['./markup/img/spr_*/**/*.png'],
                tasks: ['sprite', 'build_sass', 'copy:static_resource', 'sync']
            },

            image: {
                files: [
                    'markup/img/**/*.png',
                    '!markup/img/spr_*.png',
                    '!markup/img/spr_*/**/*.png'
                ],
                tasks: ['sync']
            }

        },

        concurrent: {
            options: {
                logConcurrentOutput: false
            },
            build: ['sass_init','html'],
            deploy: ['sass_init','html']
        },

    });

    // default
    grunt.registerTask('default', ['clean', 'concurrent:build', 'watch']);
    grunt.registerTask('deploy', ['clean', 'sassNoMap', 'concurrent:deploy']);

    grunt.registerTask('build_sass', ['sass', 'postcss']); //cssmin테스크를 뺴고 돌리면 sass옵션이 제대로 실행됨
    // grunt.registerTask('build_sass', ['sass', 'postcss', 'cssmin']); 
    grunt.registerTask('sass_init', ['sprite_common_func', 'sprite', 'build_sass', 'copy:static_resource']);

    grunt.registerTask('sass_init2', ['serverUrl', 'sprite_common_func', 'sprite', 'build_sass', 'copy:static_resource']);
    grunt.registerTask('html', ['includereplace', 'markupfileindex']);
    grunt.registerTask('sprite_common_func', function () {
        _.each(grunt.config.data.sprite, function(conf){
            if(!!conf.cssTemplate === false){
                conf.cssTemplate = function (params) {
                    var template = grunt.file.read('./markup/sass/sprites/sprites.mustache');
                    return Mustache.render(template, params);
                }
            }

            if(!!conf.cssOpts === false){
                conf.cssOpts = {
                    removepx: function () {
                        return function (text, render) {
                            var value = render(text);
                            return '0px' === value ? '0' : value;
                        };
                    },
                    retina: function () {
                        return function (text, render) {
                            var pixelRatio = 2;
                            return parseInt(render(text), 10) / pixelRatio + 'px';
                        };
                    }
                }
            }
        });
    });
    // sass map 생성 여부
    grunt.registerTask('sassNoMap', function () {
        grunt.option('no-map', true);
    });
    grunt.registerTask('serverUrl', function () {
        // var templateTaskName = ['spr_template', 'spr_template_2x'],
        var url = '';

        // if(e === 'deploy'){
        url = '../images';
        // grunt.config.data.IMG_DIR = '이미지 절대경로';
        //     url = '이미지 상대경로';
        // }

        _.each(grunt.config.data.sprite, function(conf, key){
            // if(templateTaskName.indexOf(key) !== -1) {
            conf.imgPath = url + '/' + key + '.png';
            //}
        });
    });
};
