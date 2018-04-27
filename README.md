# This is our project now. D:

## critical bugs for testing prototype
### medication plan on midata is broken

### returning to app after reminder notification broken
- eMMA gets stuck after pressing the "Zeig mir meine Medikation"-Button
- bug in conversation.ts / AwnswerReminder() function
  - runs until line 312: `LocalNotifications.getTriggered(1).then((res)=>{`
  - gets stuck there
- notifications get set in conversation.ts / addlocalnotification, from line 716

      let notification = {
        id: 1,
        title: 'eMMA hat dir geschrieben',
        text: 'Es ist jetzt ' + time+". Ich wollte dich daran erinnern",
        data: timeOfDay,
        at: firstNotificationTime,
      };
- maybe also a reload-problem - check original emmas whitelist
- https://github.com/tschm2/Thesis/commit/07eb00929312e0a71e6d51fb0e20c37d8398621f
- tests 04.04.: notification kann nicht geholt werden (erscheint aber, ergo wird sie offensichtlich richtig geschrieben): getTriggeredIds() gibt leeres Array zurück
- __workaround 05.05.__: emma fragt immer nach der Morgen-Medikation, um die fehlerhafte Promise zu umgehen

## non critical bugs for testing prototype
### hciquery is not working well
- problem with query __solved__: returned http-state 404 because index.hcisolutions.ch was not on _whitelist_ anymore
- a functioning query-url (directly in the browser) is, with medikament ID 3365788 (ACLASTA): https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=phar&key=3365788&index=hospINDEX
- problem remaining: medication pharmacodes from example mediplan are NOT in the hospINDEX ??!?
  - bug can be worked around with DummyData-Set
  - eMMA-Example Mediplan is ok:
    - 4491130 Bactrim
    - 2810364 Co-Diovan
    - 1927420 Sortis
    - 4763137 Panadol
