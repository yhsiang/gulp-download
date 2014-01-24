var through = require("through2");
var gutil = require("gulp-util");
var request = require("request");

module.exports = function(files){

	var files = typeof files === "string" ? [files] : files;

	var stream = through.obj(function(file,enc,callback){
		this.push(file);
		callback();
	});

	var downloaded = 0;

	files.forEach(function(file){
		request(file,function(err,res,body){
			if(err){
				gutil.log(gutil.colors.red('Error'), 'in Plugin', '\''+gutil.colors.cyan('gulp-download')+'\'', ': Failed downloading file', gutil.colors.magenta(file), 'skipping download');
			}else{
				stream.write(new gutil.File({
					path:file.split("/").pop(),
					contents: new Buffer(body)
				}));
			}

			downloaded++;

			if(downloaded === files.length) stream.end();
		});
	});

	return stream;
}