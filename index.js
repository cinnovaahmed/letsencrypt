var http = require('http'); // 1 - Import Node.js core module
const https = require('https'); // Import Node.js core module for https
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const bodyParser = require('body-parser');
const { extractCertbotInfo, extractDomains } = require('./utility')
const fs = require('fs');

const sslOptions = {
    key: fs.readFileSync('/root/fuseDir/live/lab.unifiedeverything.com/privkey.pem'), // Replace with the path to your key file
    cert: fs.readFileSync('/root/fuseDir/live/lab.unifiedeverything.com/fullchain.pem'), // Replace with the path to your fullchain file
};

var server = https.createServer(sslOptions, function (req, res) {

    bodyParser.json()(req, res, async function () {
        // if (req.url == '/') { //check the URL of the current request
        //     console.log(req.body, 'abc')
        //     const body = req.body;
        //     try {
        //         // let certDomainsStr = extractDomains(body);
        //         // console.log(certDomainsStr)
        //         const child = exec(`./my_script.sh "*.${req.body.portalRoot}" "${req.body.email}"`,
        //             (error, stdout, stderr) => {
        //                 console.log('Command:', error);
        //                 console.log('stdout:', stdout);
        //                 console.log('stderr:', stderr);

        //                 if (error !== null) {
        //                     console.log(`exec error: ${error}`);
        //                 }
        //                 res.writeHead(200, { 'Content-Type': 'application/json' });
        //                 res.end(JSON.stringify({ stdout, stderr, error }));

        //             });

        //     } catch (error) {
        //         res.writeHead(500, { 'Content-Type': 'application/json' });

        //         // set response content    

        //         res.write(error);
        //         res.end();
        //     }

        // }
        // if (req.url == '/generate-certs') { //check the URL of the current request
        //     console.log(req.body, 'abc')
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
        //                             res.writeHead(200, { 'Content-Type': 'application/json' });
        //                             res.end(JSON.stringify({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout }));

        //                         });


        //                 }

        //             });

        //     } catch (error) {
        //         res.writeHead(500, { 'Content-Type': 'application/json' });

        //         // set response content    

        //         res.write(error);
        //         res.end();
        //     }

        // }
        if (req.url == '/') { //check the URL of the current request
            console.log(req.body, 'abc');
            const body = req.body;
            try {
                const { error, stdout, stderr } = await exec(`./my_script.sh "*.${req.body.portalRoot}" "${req.body.email}"`);
                console.log('Command:', error);
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ stdout, stderr, error }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(error);
                res.end();
            }
        }

        if (req.url == '/generate-certs') { //check the URL of the current request
            console.log(req.body, 'abc');
            try {
                const { error, stdout, stderr } = await exec(`./generate_certs.sh "*.${req.body.portalRoot}" "${req.body.email}"`);
                console.log('Command:', error);
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
                if (stdout.includes('Successfully received certificate')) {
                    const certData = extractCertbotInfo(stdout);
                    const path = certData.certPath.split('/');
                    path.pop();
                    let domainCert = path.pop();
                    const dirPath = path.join('/');
                    console.log(domainCert);
                    const { copyError, copyStdout, copyStderr } = await exec(`./copy_script.sh "${domainCert}"`);
                    console.log('Command:', copyError);
                    console.log('stdout:', copyStdout);
                    console.log('stderr:', copyStderr);
                    if (copyError !== null) {
                        console.log(`exec copyError: ${copyError}`);
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout }));
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(error);
                res.end();
            }
        }
        // if (req.url == '/renew-certs') { //check the URL of the current request
        //     console.log(req.body, 'abc')
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
        //                             res.writeHead(200, { 'Content-Type': 'application/json' });
        //                             res.end(JSON.stringify({ stdout, stderr, error, certData, copyError, copyStderr, copyStdout }));

        //                         });


        //                 }

        //             });

        //     } catch (error) {
        //         res.writeHead(500, { 'Content-Type': 'application/json' });

        //         // set response content    

        //         res.write(error);
        //         res.end();
        //     }

        // }
        // if (req.url == '/delete-cert') { //check the URL of the current request
        //     console.log(req.body, 'abc')
        //     try {
        //         const child = exec(`./delete_cert.sh "*.${req.body.portalRoot}"`,
        //             (error, stdout, stderr) => {

        //                 console.log('Command:', error);
        //                 console.log('stdout:', stdout);
        //                 console.log('stderr:', stderr);

        //                 res.writeHead(200, { 'Content-Type': 'application/json' });
        //                 res.end(JSON.stringify({ stdout, stderr, error }));

        //             });

        //     } catch (error) {
        //         res.writeHead(500, { 'Content-Type': 'application/json' });

        //         // set response content    

        //         res.write(error);
        //         res.end();
        //     }

        // }
        if (req.url == '/delete-cert') { //check the URL of the current request
            console.log(req.body, 'abc');
            try {
                const { stdout, stderr } = await exec(`./delete_cert.sh "*.${req.body.portalRoot}"`);

                console.log('stdout:', stdout);
                console.log('stderr:', stderr);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ stdout, stderr, error: null }));
            } catch (error) {
                console.log('Command error:', error);

                res.writeHead(500, { 'Content-Type': 'application/json' });
                // Assuming `error` is an Error object, you might want to stringify `error.message` instead of `error` directly
                res.end(JSON.stringify({ error: error.message }));
            }
        }

    })


});

server.listen(8001); //3 - listen for any incoming requests

console.log('Node.js web server at port 8001 is running..')

