# eMMA zum Laufen bringen
Um eMMA zum laufen zu bringen, müssen folgende Pakete installiert werden, die npm nicht automatisch installiert:

## MIDATA
- npm install https://github.com/i4mi/midata.js

## PAKO
- npm install pako

## QR-Code
- npm install angular2-qrcode (das vermutlich nicht?)
- ionic cordova plugin add phonegap-plugin-barcodescanner
- npm install --save @ionic-native/barcode-scanner
-> https://www.techiediaries.com/barcode-qr-code-scanner-encoder-ionic-3/

# APK-Datei generieren
Um eine APK-Datei zu generieren, muss Android Studio installiert sein. Ich musste zusätzlich noch Gradle installieren (auf dem Mac mit installiertem Homebrew: `brew install gradle`).
mittels `cordova build android` wird dann eine APK gebaut, die man auf sein Android-Handy laden kann.
