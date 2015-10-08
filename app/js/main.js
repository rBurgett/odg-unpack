var path = require('path'),
    fs = require('fs-extra'),
    archiver = require('archiver'),
    DecompressZip = require('decompress-zip'),
    gui = require('nw.gui');

var win = gui.Window.get();
win.title = 'ODG Converter';

win.focus();

var unpackODG = function(filePath) {

    var dirPath = path.dirname(filePath);
    var folderName = path.basename(filePath, '.odg');

    var unzipper = new DecompressZip(filePath);

    unzipper.on('error', function(err) {
        console.error(err);
        alert(err.message);
    });
    unzipper.on('extract', function(log) {
        win.focus();
        alert('Done!');
    });

    unzipper.extract({
        path: path.join(dirPath, folderName)
    });
}
var packODG = function(filePath) {

    var dirPath = path.dirname(filePath);
    var fileName = path.basename(filePath);

    var dirContents;

    try {
        dirContents = fs.readdirSync(filePath);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }

    _.each(dirContents, function(file) {
        if(/\.DS_Store/.test(file)) {
            try {
                fs.removeSync(path.join(filePath, file));
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    });

    var outputPath = filePath + '.odg';

    var output = fs.createWriteStream(outputPath);

    var archive = archiver('zip');

    archive.on('finish', function() {
        win.focus();
        alert('Done!');
    });

    archive.on('error', function(err) {
        reject(err);
    });

    archive.pipe(output);

    archive.directory(filePath, false);

    archive.finalize();

}

$(document).ready(function() {

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        // console.log(e.target.id);
        if(e.target.id === 'js-dropDiv' || e.target.id === 'js-droppable') {
            var file = e.dataTransfer.files[0];
            var filePath = file.path;
            // console.log('File path is', filePath);

            if(path.extname(filePath) === '.odg') {
                unpackODG(filePath);
            } else {
                packODG(filePath);
            }
        }
    });

    $('#js-dropDiv').on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $('#js-dropDiv').on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
});
