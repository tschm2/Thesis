# Elemente in Storage
Diese Datei beschreibt, welche Objekte eMMA im Storage-Objekt in ionic ablegt

## ComplianceData
- geschrieben von conversation.ts, my-medication.ts, my-medication-diary.ts, barCodeService.ts
- Object
- enthält die Daten wie der Patient die Medikamente eingenommen hat

## FirstStartComplet (sic!)
- geschrieben von conversation.ts
- entweder ein Boolean oder ein String
- enthält Daten ob der erste Start mit App-Einrichtung abgeschlossen wurde, sowie ob eine Notification vorliegt

## takingTime
- geschrieben von conversation.ts, my-medication.ts
- String-Array
- enthält die Einnahme-Zeiten der Medikamente (standardmässig 08:00, 12:00, 18:00 und 22:00)

## name
- geschrieben von conversation.ts
- String
- der Name des Patienten

## Pin
- geschrieben von conversation.ts
- String
- der Pin des Patienten (null wenn nicht gesetzt)

## athlete
- geschrieben von conversation.ts
- Boolean
- beschreibt, ob der User angegeben hat Leistungssport zu betreiben

## driver
- geschrieben von conversation.ts
- Boolean
- beschreibt, ob der User angegeben hat einen Führerschein zu haben

## UsernameEHealht (sic!)
- geschrieben von conversation.ts
- String
- enthält Login für ComplianceData

## returnValuePatientCompliance
- geschrieben von conversation.ts
- ?
- ?

## mediPlan
- geschrieben von my-medication.ts, barCodeService.ts, chmedJsonHandler.ts
- Object
- wird wohl der gescannte oder geladene Mediplan hrerschein

## medicationData
- geschrieben von my-medication.ts, barCodeService.ts
- Object (?)
- ?

## sound
- geschrieben von my-medication.ts
- ?
- vermutlich die gewählte Einstellung für den Notifikations-Ton (funktioniert nicht?)

## checks
- geschrieben von barCodeService.ts
- ?
- ?
