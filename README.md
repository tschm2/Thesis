# This is our project now. D:

## TO DO
### bug with manually added medications, that are going to queried for compendium
- when the instruction interface does a compendium check with a medication that is in the medication list, but has been added manually (not from scanning mediplan), this goes wrong. the problem is probably, that we try to use the medicaments pharmaID for the compendium query (so we can directly link to the patient information); but when added manually, there is no pharmaID set.

### instruction interface: scan#
- is not usable at the moment
- needs also better handling in rivescript

### persist hausarzt
- now, rivescript forgets about the hausarzt every time the bot is reloaded (and that's a lot). annoying.
- to do here:
  - instruction interface for writing hausarzt to the storage (compare name#)
    - adjust `botService.generateAndLoadFile()`, so that hausarzt is written to `generated.rive` (as bot variable, e.g. `!var doctor = Dr. Wenger`)
   - adjust rivescripting so bot variable is set to the user variable when accessed for the first time

### give chatbot knowledge about the Nahrungsmittelinteraktionen
- read informations from `storage`
- add to `generated.rive` file
- handle in rivescript

### scripting
 - eMMA still is not that intelligent, the rivescripts have to be adjusted (work in progress, Gabriel)

### compliance information: write to midata
- also the question: how to encode (SNOMED CT)
- maybe. maybe not.

## DONE
###  writing and loading multiple RiveScript files
- finally!!

### find a way to trigger the compliance entering form from chatbot
- it's called instruction interface, baby (°_,')

## documentation of bugs that are not going to be fixed
### medication plan on midata is broken
- whole midata thing is broken
### emma nutrition view crashes
- (checks.body is NULL) -> on App, page is displayed, but without any information
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
