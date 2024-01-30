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

module.exports = { extractDomains }