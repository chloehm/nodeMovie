module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'model/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js', //当前入口文件
                    args: [],
                    ignoredFiles: ['README.md', 'node_module/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        port: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            } 
        }
    })
    grunt.loadNpmTasks('grunt-contrib-watch') //热响应
    grunt.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent') //编译less，sass等

    grunt.option('force', true)
    grunt.registerTask('default', ['concurrent:target'])
}