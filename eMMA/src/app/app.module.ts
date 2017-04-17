import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
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

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
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
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    NutritionPage,
    AboutEmmaPage,
    MyMedicationDiaryPage,
    ConversationPage,
    MyMedicationPage,
    UpdatePage,
    MedicationReminderViewPage
  ],
  providers: [Storage,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
