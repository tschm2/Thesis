# This is our project now. D:

## TO DO
### writing and loading multiple RiveScript files
At the time, 3 .rive Files are loaded by the bot
- but the way the file path is resolved and the files are loaded is not very elegant.
- we have to find a way to write the `medication.rive` file with the actual medication data

## critical bugs for testing prototype
### medication plan on midata is broken
still broken
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

## Documentation of Bugs that are not going to be fixed
- emma nutrition view crashes
