var path = require('path'),
    fs = require('fs-extra'),
    archiver = require('archiver'),
    DecompressZip = require('decompress-zip'),
    gui = require('nw.gui');

var win = gui.Window.get();
win.title = 'ODG Converter';

win.focus();

var showSuccess = function() {
    $('#js-successAlert').css('display', 'block');
    setTimeout(function() {
        $('#js-successAlert').css('opacity', 1);
        setTimeout(function() {
            $('#js-successAlert').css('opacity', 0);
            setTimeout(function() {
                $('#js-successAlert').css('display', 'none');
            }, 1000);
        }, 2000);
    }, 0);
};

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
        showSuccess();
    });

    unzipper.extract({
        path: path.join(dirPath, folderName)
    });
}
var packODG = function(filePath) {

    var removeClutter = function(folderPath) {
        var items;
        try {
            items = fs.readdirSync(folderPath);
        } catch(err) {
            console.error(err);
            alert(err.message);
        }
        _.each(items, function(item) {
            var itemPath = path.join(folderPath, item);
            if(item === '.DS_Store') {
                try {
                    fs.removeSync(itemPath);
                } catch(err) {
                    console.error(err);
                    alert(err.message);
                }
            } else {
                var itemStats;
                try {
                    itemStats = fs.statSync(itemPath);
                } catch(err) {
                    console.error(err);
                    alert(err.message);
                }
                if(itemStats.isDirectory()) {
                    removeClutter(itemPath);
                }
            }

        });
    };

    var dirPath = path.dirname(filePath);
    var fileName = path.basename(filePath);

    removeClutter(filePath);

    var outputPath = filePath + '.odg';

    var output = fs.createWriteStream(outputPath);

    var archive = archiver('zip');

    archive.on('finish', function() {
        win.focus();
        showSuccess();
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

        if(e.target.id === 'js-dropDiv' || e.target.id === 'js-droppable') {
            var file = e.dataTransfer.files[0];
            var filePath = file.path;

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
