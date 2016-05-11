var fs = require('fs-extra'),
    path = require('path');

const tempDir = path.join('..', 'build-temp');

fs.emptyDirSync(tempDir);

const filesToCopy = [
    path.join('app'),
    path.join('bower_components'),
    path.join('package.json')
];

filesToCopy.forEach((f) => {
    fs.copySync(path.join('..', f), path.join(tempDir, f));
});
