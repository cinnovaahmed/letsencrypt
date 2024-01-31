function extractDomains(body) {
    let domain = body.portalRoot.split('.')
    let end = domain.pop();
    domain.reverse();
    domain.pop();
    let certDomains = []
    let certDomainsStr = '';

    domain.forEach((element, i) => {
        if (!i) {
            certDomains.push(`${element}.${end}`)
            certDomains.push(`*.${element}.${end}`)
        }
        else {
            certDomains.push(`*.${element}.${certDomains[0]}`)
        }
    })

    certDomainsStr = certDomains.join()
    return certDomainsStr;
}


function extractCertbotInfo(certbotOutput) {
    const expiryRegex = /This certificate expires on (\d{4}-\d{2}-\d{2})/;
    const pathRegex = /Certificate is saved at: (.+)\nKey is saved at: (.+)/;

    const expiryMatch = certbotOutput.match(expiryRegex);
    const pathMatch = certbotOutput.match(pathRegex);

    if (!expiryMatch || !pathMatch) {
        // Handle case where regex matching fails
        return null;
    }

    const expiryDate = expiryMatch[1];
    const certPath = pathMatch[1];
    const keyPath = pathMatch[2];

    return {
        expiryDate: expiryDate,
        certPath: certPath,
        keyPath: keyPath
    };
}

module.exports = { extractDomains, extractCertbotInfo }