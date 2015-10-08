$(document).ready(function() {
    console.log('Ready!');

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        // console.log(e.target.id);
        if(e.target.id === 'js-dropDiv') {
            var file = e.dataTransfer.files[0];
            var filePath = file.path;
            console.log('File path is', filePath);
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
