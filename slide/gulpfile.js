var url = require('url'),
    fs = require('fs'),
    path = require('path');

// 加载gulp插件
var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect');

//web服务器
gulp.task('server',function(){
    connect.server({
        middleware: function(connect, options) {
        return [
            function(req, res, next) {
                var filepath = path.join(options.root, req.url);
                if ('POSTPUTDELETE'.indexOf(req.method.toUpperCase()) > -1
                    && fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {

                    //设置utf-8编码
                    res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');

                    return res.end(fs.readFileSync(filepath));
                }

                return next();
               }

            ];
        },
        hostname: '127.0.0.1',
        port: 8090,
        livereload: true
    });
});


// 默认任务
gulp.task('default', ['server']);