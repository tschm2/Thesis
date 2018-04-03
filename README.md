# This is our project now. D:

## critical bugs for testing prototype
### medication plan on midata is broken

### returning to app after reminder notification broken
- eMMA gets stuck after pressing the "Zeig mir meine Medikation"-Button
- bug in conversation.ts / AwnswerReminder() function
  - runs until line 312: `LocalNotifications.getTriggered(1).then((res)=>{`
  - gets stuck there -

## non critical bugs for testing prototype
### hciquery is not working well
- problem with query __solved__: returned http-state 404 because index.hcisolutions was not on _whitelist_ anymore
- a functioning query-url (directly in the browser) is, with medikament ID 3365788 (ACLASTA): https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=phar&key=3365788&index=hospINDEX
- problem remaining: medication pharmacodes from example mediplan are NOT in the hospINDEX ??!?
- > bug can be worked around with DummyData-Set
