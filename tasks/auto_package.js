var walk = require('walk');
var fs = require('fs');
var path = require('path');
var Uglify = require('uglify-js');
var cwd = process.cwd();

module.exports = function ( grunt ) {
  grunt.registerMultiTask('auto_package', function () {
    var done = this.async();
    var options = this.options();
    var fileName = options.fileName || '__build.js';
    var walker = walk.walk(path.join(cwd, options.base));

    walker.on('directory', function ( root, stat, next) {
      var pathDir = path.join(root, stat.name);
      fs.readdir(pathDir, function (err, fileList) {
        grunt.verbose.write('Entering in ' + pathDir);
        var nPosIndexJSON = fileList.indexOf('_index.json'),
        sPathBuildJS = path.join(root, stat.name, fileName),
        sCode = '',
        oCode,
        nPosBuild,
        nItem,
        nLenFiles,
        file,
        aFiles;
        if( nPosIndexJSON === -1 ) {
          grunt.verbose.write('Compiling all the packages without dependencies.');
          nPosBuild = fileList.indexOf(fileName);
          if(nPosBuild !== -1){
            grunt.verbose.write('Removing previous version of ' + fileName.cyan);
            fileList.splice(nPosBuild, 1);
            fs.unlinkSync(sPathBuildJS);
          }
          aFiles = fileList;
          nLenFiles = aFiles.length;
          for(nItem = 0; nItem < nLenFiles; nItem++){
            file = fileList[nItem];
            grunt.verbose.write('Get the code of ' + file.cyan );
            sCode += fs.readFileSync(path.join(root, stat.name, file), 'utf-8');
          }
          oCode = Uglify.minify(sCode, { fromString: true });
          grunt.verbose.write('Code of the package minimized' );
          fs.writeFile(sPathBuildJS, oCode.code, function(){
            grunt.log.ok( 'File ' + fileName.cyan + ' generated in ' + pathDir.magenta );
          });
        }
        next();
      });
    });
    walker.on('end', function (){
      var walker = walk.walk(path.join(cwd, options.base));
      walker.on('directory', function ( root, stat, next) {
        var pathDir = path.join(root, stat.name);
        fs.readdir(pathDir, function (err, fileList) {
          var nPosIndexJSON = fileList.indexOf('_index.json'),
          sPathBuildJS = path.join(root, stat.name, fileName),
          sCode = '',
          oCode,
          nItem,
          nLenFiles,
          file,
          aFiles;

          if( nPosIndexJSON !== -1 ) {
            grunt.verbose.write('Compiling all the packages with dependencies.');
            aFiles = require(path.join(root, stat.name, '_index.json'));
            aFiles = aFiles.map(function ( value, index, arr ) {
              if(value.indexOf('_') === 0){
                return value;
              }else{
                return value + '.js';
              }
            });
            nLenFiles = aFiles.length;
            for( nItem = 0; nItem < nLenFiles; nItem++){
              file = aFiles[nItem];
              if(file.indexOf('_') !== 0){
                grunt.verbose.write('Get the code of ' + file.cyan );
                sCode += fs.readFileSync(path.join(root, stat.name, file), 'utf-8');
              }else{
                grunt.verbose.write('Get the code of ' + file.cyan + ' build package.');
                sCode += fs.readFileSync(path.join(root, stat.name, file, fileName), 'utf-8');
              }
            }
            oCode = Uglify.minify(sCode, { fromString: true });
            grunt.verbose.write('Code of the package minimized' );
            fs.writeFile(sPathBuildJS, oCode.code, function () {
              grunt.log.ok( 'File ' + fileName.cyan + ' generated in ' + pathDir.magenta );
            });
          }
          next();
        });
      });
      walker.on('end', function (){
        grunt.log.ok('AutoPackage task finished without errors.'.green);
        done();
      });
    });
  });
};