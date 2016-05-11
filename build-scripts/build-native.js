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
            version: '0.14.3',
            buildDir: '../build',
            zip: false,
            winIco: (platform === 'win32') ? '../app/images/favicon.ico' : '',
            macIcns: (platform === 'darwin') ? '../app/images/nw.icns' : ''
        });

        //Log stuff you want

        nw.on('log',  console.log);

        // Build returns a promise
        nw.build().then(function () {
           console.log('all done!');
        }).catch(function (error) {
            console.error(error);
        });
    }
});
