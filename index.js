var http = require('http'); // 1 - Import Node.js core module
const https = require('https'); // Import Node.js core module for https
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
const { extractCertbotInfo, extractDomains } = require('./utility')
const fs = require('fs');

const sslOptions = {
    key: fs.readFileSync('/root/fuseDir/live/lab.unifiedeverything.com/privkey.pem'), // Replace with the path to your key file
    cert: fs.readFileSync('/root/fuseDir/live/lab.unifiedeverything.com/fullchain.pem'), // Replace with the path to your fullchain file
};

var server = https.createServer(sslOptions, function (req, res) {

    bodyParser.json()(req, res, async function () {
        if (req.url == '/generate-txt') { //check the URL of the current request
            console.log(req.body, 'abc')
            const body = req.body;
            try {
                // let certDomainsStr = extractDomains(body);
                // console.log(certDomainsStr)
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
        if (req.url == '/generate-certs') { //check the URL of the current request
            console.log(req.body, 'abc')
            try {
                const child = exec(`./generate_certs.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
                    (error, stdout, stderr) => {

                        console.log('Command:', error);
                        console.log('stdout:', stdout);
                        console.log('stderr:', stderr);
                        if (stdout.includes('Successfully received certificate')) {
                            const certData = extractCertbotInfo(stdout)
                            const path = certData.certPath.split('/');
                            path.pop();
                            let domainCert = path.pop();
                            const dirPath = path.join('/');
                            console.log(domainCert);
                            if (req.body.suDomainsBoolean) {
                                const child = exec(`./copy_core_script.sh "${domainCert}"`,
                                    (copyError, copyStdout, copyStderr) => {

                                        console.log('Command:', copyError);
                                        console.log('stdout:', copyStdout);
                                        console.log('stderr:', copyStderr);



                                        if (copyError !== null) {
                                            console.log(`exec copyError: ${copyError}`);
                                        }
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout }));

                                    });
                            }
                            else {

                                const child = exec(`./copy_script.sh "${domainCert}"`,
                                    (copyError, copyStdout, copyStderr) => {

                                        console.log('Command:', copyError);
                                        console.log('stdout:', copyStdout);
                                        console.log('stderr:', copyStderr);



                                        if (copyError !== null) {
                                            console.log(`exec copyError: ${copyError}`);
                                        }
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout }));

                                    });
                            }


                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ stdout, stderr, error }));

                        }

                    });

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });

                // set response content    

                res.write(error);
                res.end();
            }

        }
        if (req.url == '/renew-certs') { //check the URL of the current request
            console.log(req.body, 'abc')
            try {
                const child = exec(`./renew_certs.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
                    (error, stdout, stderr) => {

                        console.log('Command:', error);
                        console.log('stdout:', stdout);
                        console.log('stderr:', stderr);
                        if (stdout.includes('Successfully received certificate')) {
                            const certData = extractCertbotInfo(stdout)
                            const path = certData.certPath.split('/');
                            path.pop();
                            let domainCert = path.pop();
                            const dirPath = path.join('/');
                            console.log(domainCert);

                            const child = exec(`./renew_copy_script.sh "${domainCert}"`,
                                (copyError, copyStdout, copyStderr) => {

                                    console.log('Command:', copyError);
                                    console.log('stdout:', copyStdout);
                                    console.log('stderr:', copyStderr);



                                    if (copyError !== null) {
                                        console.log(`exec copyError: ${copyError}`);
                                    }
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout }));

                                });


                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ stdout, stderr, error }));

                        }
                    });

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });

                // set response content    

                res.write(error);
                res.end();
            }

        }
        if (req.url == '/delete-cert') { //check the URL of the current request
            console.log(req.body, 'abc')
            try {
                const child = exec(`./delete_cert.sh "${req.body.oldPortalRoot}"`,
                    (delError, delStdout, delStderr) => {

                        console.log('Command:', delError);
                        console.log('delStdout:', delStdout);
                        console.log('delStderr:', delStderr);

                        // res.writeHead(200, { 'Content-Type': 'application/json' });
                        // res.end(JSON.stringify({ stdout, stderr, error }));
                        const child = exec(`./my_script.sh "*.${req.body.newPortalRoot}" "${req.body.email}"`,
                            (error, stdout, stderr) => {
                                console.log('Command:', error);
                                console.log('stdout:', stdout);
                                console.log('stderr:', stderr);

                                if (error !== null) {
                                    console.log(`exec error: ${error}`);
                                }
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ stdout, stderr, error, delError, delStderr, delStdout }));

                            });
                    });

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });

                // set response content    

                res.write(error);
                res.end();
            }

        }
        if (req.url == '/generate-core-txt') { //check the URL of the current request
            console.log(req.body, 'abc')
            const body = req.body;
            try {
                // let certDomainsStr = extractDomains(body);
                // console.log(certDomainsStr)
                let suDomains = req.body.superDomains.map((x) => `*.${x}`).join(',')
                const child = exec(`./core_txt_generation.sh "${suDomains}" "${req.body.email}" "${req.body.superDomains.length}"`,
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
        if (req.url == '/delete-core-cert') { //check the URL of the current request
            console.log(req.body, 'abc')
            try {
                const child = exec(`./delete_cert.sh "${req.body.portalRoot}"`,
                    (delError, delStdout, delStderr) => {

                        console.log('Command:', delError);
                        console.log('delStdout:', delStdout);
                        console.log('delStderr:', delStderr);


                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ delError, delStderr, delStdout }));
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


