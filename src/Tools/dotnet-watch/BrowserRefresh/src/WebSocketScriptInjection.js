
setTimeout(function () {
    // dotnet-watch browser reload script
    let connection;
    try {
        connection = new WebSocket('{{hostString}}');
    } catch (ex) {
        console.debug(ex);
        return;
    }
    connection.onmessage = function (message) {
        console.debug(message);
        if (message.data === 'Wait') {
            console.debug('dotnet-watch: File changes detected. Waiting for application to rebuild.');
            if (document.title.indexOf('Waiting: ') < 0)
                document.title = 'Waiting: ' + document.title;
        }
        else {
            var msgJson = JSON.parse(message.data);
            if (msgJson.message === 'Reload') {
                var changedFile = msgJson.changedFile;
                if (!changedFile.endsWith('.css')) {
                    console.debug('dotnet-watch: Server is ready. Reloading...');
                    location.reload();
                }
                else {
                    console.debug('dotnet-watch: Server is ready. But ignore Reload as changed file is css.');
                    document.title = document.title.replace('Waiting: ', '');
                }
            }
        }
    }
    connection.onerror = function (event) { console.debug('dotnet-watch reload socket error.', event) }
    connection.onclose = function () { console.debug('dotnet-watch reload socket closed.') }
    connection.onopen = function () { console.debug('dotnet-watch reload socket connected.') }
}, 500);
