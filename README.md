# This is our project now. D:


## TO DO

#### give feedback if adding medication did not work
- probably via alert(), since retVal can not be filled within the promise

#### give chatbot knowledge about the Nahrungsmittelinteraktionen
- read informations from `storage`
- add to `generated.rive` file
- handle in rivescript

#### feature: scan new mediplan

#### scripting
- eMMA still is not that intelligent, the rivescripts have to be adjusted (work in progress, Gabriel)

#### compliance information: write to midata
- also the question: how to encode (SNOMED CT)
- maybe. maybe not. probably not.


## DONE
#### when scanning a medicament via scan#, units are undefined
- are not undefined anymore, but empty string when scanned from medication box (unit information not in data from hci solucions?)
- but if undefined, units are not shown anymore
- thus, units are only shown if medication was scanned from a mediplan

#### botservice.init() after adding a medicament
- better: used generateAndLoadFile()

#### when reminder / compliance was set, chatbot is not initialized again

####
- do medication check after inserting new medicaments

#### instruction interface: scan#
- now works quite good

#### bug with manually added medications, that are going to queried for compendium
- was only a one-liner :)

#### persist hausarzt
- now, rivescript forgets about the hausarzt every time the bot is reloaded (and that's a lot). annoying.
- to do here:
  - *DONE*: instruction interface for writing hausarzt to the storage (compare name#)
  - *DONE*: adjust `botService.generateAndLoadFile()`, so that hausarzt is written to `generated.rive` (as bot variable, e.g. `!var doctor = Dr. Wenger`)
  - *DONE* adjust rivescripting so bot variable is set to the user variable when accessed for the first time

####  writing and loading multiple RiveScript files
- finally!!

#### find a way to trigger the compliance entering form from chatbot
- it's called instruction interface, baby


## documentation of bugs that are not going to be fixed

#### medication plan on midata is broken
- whole midata thing is broken

#### emma nutrition view crashes
- (checks.body is NULL) -> on App, page is displayed, but without any information
- 08.06.: somehow this is working now...?

#### returning to app after reminder notification broken
- eMMA gets stuck after pressing the "Zeig mir meine Medikation"-Button
- workaround 05.05: emma fragt immer nach der Morgen-Medikation, um die fehlerhafte Promise zu umgehen
