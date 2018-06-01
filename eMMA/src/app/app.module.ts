import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NutritionPage } from '../pages/nutrition/nutrition';
import { AboutEmmaPage } from '../pages/about-emma/about-emma';
import { MyMedicationDiaryPage } from '../pages/my-medication-diary/my-medication-diary';
import { ConversationPage } from '../pages/conversation/conversation';
import { MyMedicationPage } from '../pages/my-medication/my-medication';
import { MedicationReminderViewPage } from '../pages/medication-reminder-view/medication-reminder-view';
import { UpdatePage } from '../pages/update/update';
import { Storage } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { QRCodeModule } from 'angular2-qrcode';

import { BotService } from '../services/botService';
import { FileController } from '../services/fileController';
import { barcodeService } from '../services/barcodeService';
import { chmedJsonHandler } from '../services/chmedJsonHandler';
import { HCIService } from '../services/HCIService';

@NgModule({
  declarations: [
    MyApp,
    NutritionPage,
    AboutEmmaPage,
    MyMedicationDiaryPage,
    ConversationPage,
    MyMedicationPage,
    UpdatePage,
    MedicationReminderViewPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    QRCodeModule
  ],
  bootstrap: [
	  IonicApp
  ],
  entryComponents: [
    MyApp,
    NutritionPage,
    AboutEmmaPage,
    MyMedicationDiaryPage,
    ConversationPage,
    MyMedicationPage,
    UpdatePage,
    MedicationReminderViewPage
  ],
  providers: [
	  Storage,
	  BotService,
	  FileController,
	  barcodeService,
	  chmedJsonHandler,
	  HCIService,
	  {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
