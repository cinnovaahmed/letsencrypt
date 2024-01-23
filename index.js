var http = require('http'); // 1 - Import Node.js core module
const exec = require('child_process').exec;
var server = http.createServer(function (req, res) {   // 2 - creating server
    if (req.url == '/') { //check the URL of the current request
        console.log('abc')
        try {
            const child = exec('./my_script.sh "*.lab.yourdomain.com" "your-email@example.com"',
                (error, stdout, stderr) => {
                    console.log('Command:', error);
                    console.log('stdout:', stdout);
                    console.log('stderr:', stderr);

                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ stdout, stderr, error }));

                });

        } catch (error) {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            // set response content    

            res.write(error);
            res.end();
        }

    }
    if (req.url === '/abc') {
        const greenlock = require('greenlock');

        const lex = greenlock.create({
            // Replace with your domain
            servername: 'sysmon.lab.unifiedeverything.com',
            challenges: {
                'dns-01': require('greenlock-challenge-dns-provider').create(),
            },
        });

        lex.check({
            domains: ['*.lab.unifiedeverything.com'],
        }).then(() => {
            // Access the TXT data
            const txtData = lex.challenges['dns-01'].get({
                identifier: 'lab.unifiedeverything.com',
                dnsChallenge: {
                    recordName: '_acme-challenge.lab.unifiedeverything.com',
                },
            });

            console.log('TXT Data:', txtData);
        }).catch((err) => {
            console.error('Error:', err);
        });

    }
    //handle incomming requests here..

});

server.listen(8001); //3 - listen for any incoming requests

console.log('Node.js web server at port 8001 is running..')

