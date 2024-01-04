const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./cert.pem'),
});

server.on("stream", (stream, headers) => {
    console.log(stream.id);
    stream.respond({
        "content-type": "application/json",
        "status": 200
    })

    stream.end(JSON.stringify({
        "user": "Hussein",
        "id": 823
    }))
})

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
