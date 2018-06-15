

export class eMMA{
  constructor(){

  }
  // those where in questionHandler, but really fit in here better
  messageEMMA = {
    reminderMorning: "Du möchtest also die Erinnerungsfunktion am Morgen testen.",
    reminderMidday: "Du möchtest also die Erinnerungsfunktion am Mittag testen.",
    reminderEvening: "Du möchtest also die Erinnerungsfunktion am Abend testen.",
    reminderNight: "Du möchtest also die Erinnerungsfunktion in der Nacht testen.",
    deleteStorage: "OOOOPs: ich habe gerade den Speicher gelöscht, Sorry -.-",
    about: "Du möchtest also etwas über eMMA wissen.",
    selfmedication: "Ich öffne die Selbstmedikation für dich.",
	  medicationview: "Ich öffne die Medikationsansicht für dich.",
    compliance: "Gerne zeige ich dir dein Medikationstagebuch an.",
    nutrition: "Ich zeige dir, welche Nahrungsmittel du im Moment nicht essen darfst.",
    informationQuestion: "Wenn du Fragen zu einem Medikament hast, dann gib einfach den Namen ein und die Frage, die du dazu hast. Zum Beispiel Wie, Wann oder Wieso du es einnehmen musst.",
    error: "Hatschi! Entschuldigung, da ist etwas schief gegangen.",
    takingTime: ["morgens um ", "mittags um  ", "abends um ", "in der Nacht um "]
  };


  //Standard phrase for EMMA
  messageEMMA_answer_Yes_Please = "Ja, gerne";
  messageEMMA_answer_No_Thanks = "Nein, danke";
  messageEMMA_answer_Yes = "Ja"
  messageEMMA_answer_No = "Nein"

  messageEMMA_EnterPassword = "Bitte gib deinen Pin ein"
  messageEMMA_WrongPin = "Das war der falsche Pin. Versuche es bitte erneut"
  messageEMMA_ask_Possible_Question = "Für eine Übersicht, welche Fragen du mir stellen kannst, schreibe einfach ein Fragezeichen(?) in das Textfeld "
  messageEMMA_Possible_Question ="Das kannst du mich alles Fragen:\n Wann du deine Medikamente einnehmen sollst \n Wie du deine Medikamente einnehmen sollst\n und noch vieles mehr."

  //Messages used in the First App Start
  messageEMMA_FirstStart_NoName = "Du hast leider keinen Namen eingegeben.\nBitte versuche es erneut."
  messageEMMA_FirstStart_Hello_1="Hallo! Mein Name ist eMMA."
  messageEMMA_FirstStart_Hello_2 = "Wie heisst du?";
  messageEMMA_FirstStart_questionPin = "Ich werde dir als erstes einige Fragen stellen, um die App vollständig einzurichten.";
  messageEMMA_FirstStart_questionPin2 = "Möchtest du deine App mit einem Pin schützen?";
  messageEMMA_FirstStart_questionPin_Yes = "Ja, gerne";
  messageEMMA_FirstStart_questionPin_No = "Nein, danke";
  messageEMMA_FirstStart_Pin = "Gib nun bitte den Pin ein.";
  messageEMMA_FirstStart_questionAthlete = "Betreibst du Leistungssport?";
  messageEMMA_FirstStart_questionAthlete_No = "uuuh nein";
  messageEMMA_FirstStart_questionAthlete_Yes = "Ja, das tue ich";
  messageEMMA_FirstStart_questionDriver = "Besitzt du einen Führerausweis?"
  messageEMMA_FirstStart_questionDriver_Yes = "Ja, das tue ich";
  messageEMMA_FirstStart_questionDriver_No = "Nein, ich fahre nicht";
  messageEMMA_FirstStart_questionImportMediplan = "Möchtest du den QR-Code des eMediplan einscannen, um deine Daten zu importieren?";
  messageEMMA_FirstStart_questionImportMediplanAgain = "Willst du es noch einmal versuchen?";
  messageEMMA_FirstStart_questionImportMediplan_Yes = "Ja, importiere bitte meine Daten";
  messageEMMA_FirstStart_questionImportMediplan_No = "Ich habe leider keinen";
  messageEMMA_FirstStart_ImportMediplan_OpenScanner = "Ich öffne nun den Scanner."
  messageEMMA_FirstStart_ImportMediplan_success = "Deine Medikation wurde erfasst."
  messageEMMA_FirstStart_ImportMediplan_Error = "Bitte versuche erneut deine Medikation einzuscannen."
  messageEMMA_FirstStart_questionImporteHealth = "Willst du dein elektronisches Patientendossier verbinden?";
  messageEMMA_FirstStart_questionImporteHealth_Yes = "Ja, gerne"
  messageEMMA_FirstStart_questionImporteHealth_No = "Nein, ich besitze kein Dossier"
  messageEMMA_FirstStart_questioneHalthUsername = "Bitte gib deinen Usernamen ein."
  messageEMMA_FirstStart_questioneHalthPasword = "Bitte gib dein Passwort ein."
  messageEMMA_FirstStart_eHealthWrong = "Username oder Passwort falsch"
  messageEMMA_FirstStart_eHealthCorrect= "Login erfolgreich, ich habe deine Daten importiert!"
  messageEMMA_FirstStart_questionDatasecurity = "Willst du von mir noch etwas über die Datenschutzbestimmungen wissen?"
  messageEMMA_FirstStart_questionDatasecurity_Yes = "Ja, zeige mir bitte mehr.";
  messageEMMA_FirstStart_questionDatasecurity_No =  "Nein, gerade nicht danke.";
  messageEMMA_FirstStart_Datasecurity = "eMMA sendet keine deiner persönlichen Daten weiter...\n Du findest die Datenschutzbestimmungen in der App noch ausführlicher.\n Gehe dafür einfach im Menü auf 'Über eMMA'"
  messageEMMA_FirstStart_Tutorial = "Du bist nun im Fragemodus. Hier kannst du Fragen zu deiner Medikation stellen.";
  messageEMMA_FirstStart_Tutorial_2 = "Du hast neue Medikamente eingelesen. Folgende Lebensmittel solltest du mit deiner Medikation vermeiden:";

  //Messages used in the normal App Start
  messageEMMA_Normal_Start_1 = "Hallo " //Name des Benuters
  messageEMMA_Normal_Start_2 = "Gerade stehen keine Erinnerungen an. Hast du irgendwelche Fragen an mich?";

  //Messages used for a reminder
  messageEMMA_reminderAppStart_questionAll_1 = "Hallo " //Name des Benutzers
  messageEMMA_reminderAppStart_questionAll_2 = "Es ist jetzt "
  messageEMMA_reminderAppStart_questionAll_3 = " Uhr \nBitte trage ein, ob du deine Medikamente genommen hast."
  messageEMMA_reminderAppStart_showMedication = "Zeige mir meine Medikation."
  messageEMMA_reminderAppStart_TakenAll = "Sehr gut, du hast alle eingenommen. Ich habe das so eingetragen."
  messageEMMA_reminderAppStart_NotTakenAll = "Nein, habe ich nicht."
  messageEMMA_reminderAppStart_finish = "Vielen Dank für die Antwort. Ich habe deine Informationen gespeichert.\n Du bist nun wieder im Fragemodus."
  messageEMMA_reminderAppStart_finishNachBedarf = "Sehr gut, du hast nur die Medikamente nach Bedarf nicht eingenommen. Ich habe deine Informationen gespeichert.\n Du bist nun wieder im Fragemodus."
  messageEMMA_reminderAppStart_show_Medication = "Ich zeige dir nun deine aktuelle Medikation \n Bitte wähle aus, welche du nich eingenommen hast."
  messageEMMA_reminderAppStart_why_1 = "Folgende Medikamente hast du nicht genommen:"
  messageEMMA_reminderAppStart_why_2 = "Kannst du mir den Grund dafür nennen?"
  messageEMMA_reminderAppStart_why_Note = "Notiz hinterlassen"
  messageEMMA_reminderAppStart_why_notSpecified = "Ich möchte keinen Grund nennen."
  messageEMMA_reminderAppStart_why_LeaveNote = "Bitte hinterlasse mir eine Notiz."
  messageEMMA_reminderAppStart_finishNotTaken = "Vielen Dank für die Antwort. Bitte versuche das nächste Mal alle einzunehmen. Aus folgenden Gründen sind deine Medikamente wichtig für dich:\n"
}
