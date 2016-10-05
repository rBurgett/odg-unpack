var path = require('path'),
    fs = require('fs-extra'),
    archiver = require('archiver'),
    DecompressZip = require('decompress-zip');

var win = nw.Window.get();
win.title = 'OpenDocument Converter';
document.title = 'OpenDocument Converter';

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
    var folderName = path
        .basename(filePath)
        .replace(/\.\w{3}$/, '');
    const unzipPath = path.join(dirPath, folderName);

    var unzipper = new DecompressZip(filePath);

    unzipper.on('error', function(err) {
        console.error(err);
        alert(err.message);
    });
    unzipper.on('extract', function() {
        win.focus();
        showSuccess();
    });

    unzipper.extract({
        path: unzipPath
    });
};
var packODG = function(filePath) {

    let manifest;

    try {
        manifest = fs.readFileSync(path.join(filePath, 'META-INF', 'manifest.xml'), 'utf8');
    } catch(err) {
        alert(err.message);
        return;
    }

    let ext;

    if(/opendocument\.text/.test(manifest)) {
        ext = 'odt';
    } else if(/opendocument\.graphics/.test(manifest)) {
        ext = 'odg';
    } else if(/opendocument\.presentation/.test(manifest)) {
        ext = 'odp';
    } else if(/opendocument\.spreadsheet/.test(manifest)) {
        ext = 'ods';
    } else {
        alert('Sorry! Only .odt, .odg, .odp, and .ods file can be packed.');
    }

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

    // var dirPath = path.dirname(filePath);
    // var fileName = path.basename(filePath);

    removeClutter(filePath);

    var outputPath = filePath + `.${ext}`;

    var output = fs.createWriteStream(outputPath);

    var archive = archiver('zip');

    archive.on('finish', function() {
        win.focus();
        showSuccess();
    });

    archive.on('error', function(err) {
        alert(err);
    });

    archive.pipe(output);

    archive.directory(filePath, false);

    archive.finalize();

};

$(document).ready(function() {

    document.addEventListener('drop', function(e) {
        e.preventDefault();

        if(e.target.id === 'js-dropDiv' || e.target.id === 'js-droppable') {
            var file = e.dataTransfer.files[0];
            var filePath = file.path;

            const ext = path.extname(filePath);

            let stats;

            try {
                stats = fs.statSync(filePath);
            } catch(err) {
                alert(err.message);
                return;
            }

            if(
                ext === '.odt' ||
                ext === '.ods' ||
                ext === '.odp' ||
                ext === '.odg'
            ) {
                unpackODG(filePath);
            } else if(stats.isDirectory()){
                packODG(filePath);
            } else {
                alert('Sorry! Only .odt, .odg, .odp, and .ods file can be unpacked.');
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
