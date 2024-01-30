var http = require('http'); // 1 - Import Node.js core module
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
const { extractDomains } = require('./utility')

var server = http.createServer(function (req, res) {

    bodyParser.json()(req, res, async function () {
        if (req.url == '/') { //check the URL of the current request
            
            const body = req.body;
            try {
                let certDomainsStr = extractDomains(body);
                console.log(certDomainsStr)

                const child = exec(`./my_script.sh "*.${certDomainsStr}" "${req.body.email}"`,
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
                res.writeHead(500, { 'Content-Type': 'application/json' });

                // set response content    

                res.write(error);
                res.end();
            }

        }
        if (req.url == '/generate-certs') { //check the URL of the current request
            console.log(req.body, 'abc')
            try {
                const child = exec(`./my_script.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
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
                res.writeHead(500, { 'Content-Type': 'application/json' });

                // set response content    

                res.write(error);
                res.end();
            }

        }
    })


});

server.listen(8001); //3 - listen for any incoming requests

console.log('Node.js web server at port 8001 is running..')

