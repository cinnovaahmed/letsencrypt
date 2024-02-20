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
                        const child = exec(`./my_script.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
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
    })
});

server.listen(8001); //3 - listen for any incoming requests

console.log('Node.js web server at port 8001 is running..')







// Import necessary modules
// const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const { exec } = require('child_process');
// const { extractCertbotInfo, extractDomains } = require('./utility');

// // SSL options for HTTPS server
// const sslOptions = {
//     key: fs.readFileSync('/root/fuseDir/live/lab.unifiedeverything.com/privkey.pem'),
//     cert: fs.readFileSync('/root/fuseDir/live/lab.unifiedeverything.com/fullchain.pem'),
// };

// // Initialize an Express application
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Route for generating txt
// app.post('/generate-txt', (req, res) => {
//     setTimeout(() => {
//         try {
//             const child = exec(`./my_script.sh "*.${req.body.portalRoot}" "${req.body.email}"`, (error, stdout, stderr) => {
//                 if (error !== null) {
//                     console.error(`exec error: ${error}`);
//                     // return res.status(500).json({ error: `exec error: ${error}` });
//                 }
//                 res.status(200).json({ error, stdout, stderr });
//                 res.destroy()
//             });
//         } catch (error) {
//             res.status(500).json({ error: error.toString() });
//         }
//     }, 5000);
// });

// // Route for generating certificates
// app.post('/generate-certs', (req, res) => {
//     // Similar structure to /generate-txt, adjusted for certificate generation logic
//     try {
//         const child = exec(`./generate_certs.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
//             (error, stdout, stderr) => {

//                 console.log('Command:', error);
//                 console.log('stdout:', stdout);
//                 console.log('stderr:', stderr);
//                 if (stdout.includes('Successfully received certificate')) {
//                     const certData = extractCertbotInfo(stdout)
//                     const path = certData.certPath.split('/');
//                     path.pop();
//                     let domainCert = path.pop();
//                     const dirPath = path.join('/');
//                     console.log(domainCert);

//                     const child = exec(`./copy_script.sh "${domainCert}"`,
//                         (copyError, copyStdout, copyStderr) => {

//                             console.log('Command:', copyError);
//                             console.log('stdout:', copyStdout);
//                             console.log('stderr:', copyStderr);



//                             if (copyError !== null) {
//                                 console.log(`exec copyError: ${copyError}`);
//                             }
//                             res.status(200).json({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout });
//                         });


//                 }

//             });

//     } catch (error) {
//         res.status(500).json({ error: JSON.stringify(error) });
//     }
// });

// // Route for renewing certificates
// app.post('/renew-certs', (req, res) => {
//     try {
//         const child = exec(`./renew_certs.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
//             (error, stdout, stderr) => {

//                 console.log('Command:', error);
//                 console.log('stdout:', stdout);
//                 console.log('stderr:', stderr);
//                 if (stdout.includes('Successfully received certificate')) {
//                     const certData = extractCertbotInfo(stdout)
//                     const path = certData.certPath.split('/');
//                     path.pop();
//                     let domainCert = path.pop();
//                     const dirPath = path.join('/');
//                     console.log(domainCert);

//                     const child = exec(`./renew_copy_script.sh "${domainCert}"`,
//                         (copyError, copyStdout, copyStderr) => {

//                             console.log('Command:', copyError);
//                             console.log('stdout:', copyStdout);
//                             console.log('stderr:', copyStderr);



//                             if (copyError !== null) {
//                                 console.log(`exec copyError: ${copyError}`);
//                             }
//                             res.status(200).json({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout });

//                         });


//                 }

//             });

//     } catch (error) {
//         res.status(200).json({ error: error.toString() });
//     }
// });

// // Route for deleting a certificate
// app.post('/delete-cert', (req, res) => {
//     setTimeout(() => {
//         try {
//             const child = exec(`./delete_cert.sh "${req.body.portalRoot}"`, (error, stdout, stderr) => {

//                 res.status(200).json({ error, stdout, stderr });
//                 res.destroy()
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: error.toString() });
//         }
//     }, 1000);
// });

// // Create HTTPS server and pass the Express app as the request handler
// const httpsServer = https.createServer(sslOptions, app);

// // Listen on port 8001
// httpsServer.listen(8001, () => {
//     console.log('Express HTTPS server running on port 8001');
// });
