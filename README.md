# This is our project now. D:

## severe bugs
### medication plan on midata is broken

### returning after reminder notification broken
- eMMA gets stuck after pressing the "Zeig mir meine Medikation"-Button
- not yet evaluated why so

### hciquery is not working
- problem is in those lines
      `xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
        console.log("Error!");
      }`
    -> the if condition is failing: the http status returned is always 404 (also with verifiedly working URLs)
    -> __could be a problem with the whitelisting-plugin__
- a functioning query-url (directly in the browser) is, with medikament ID 3365788 (ACLASTA): https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=phar&key=3365788&index=hospINDEX
- medication pharmacodes from example mediplan are NOT in the hospINDEX ??!?
