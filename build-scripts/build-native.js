var NwBuilder = require('nw-builder'),
    fs = require('fs-extra'),
    path = require('path');

const platform = process.platform;

const nativeBuildDir = path.join('..', 'build');

fs.emptyDir(nativeBuildDir, function(err) {
    if(err) {
        console.error(err);
    } else {
        var nw = new NwBuilder({
            files: '../build-temp/**/**', // use the glob format
            platforms: (platform === 'darwin') ? ['osx64'] : (platform === 'win32') ? ['win'] : ['linux'],
            version: '0.17.5',
            flavor: 'normal',
            cacheDir: '../cache',
            forceDownload: false,
            buildDir: nativeBuildDir,
            buildType: 'default',
            zip: false,
            winIco: (platform === 'win32') ? '../app/images/favicon.ico' : '',
            macIcns: (platform === 'darwin') ? '../app/images/nw.icns' : ''
        });

        //Log stuff you want

        nw.on('log',  console.log);

        // Build returns a promise
        nw.build().then(function () {
            fs.emptyDirSync(path.join('..', 'build-temp'));
            fs.removeSync(path.join('..', 'build-temp'));
           console.log('all done!');
        }).catch(function (error) {
            console.error(error);
        });
    }
});
