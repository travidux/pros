import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import {  NgZone } from '@angular/core';
import { Toast } from '@ionic-native/toast';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isListening: boolean = false;
  matches: Array<String>;
  blnBuslist = false;
  lstBuses = [{'id':1,price:280,type:'Super Fast', 'number':'KL-15-AB-9658', 'via':'Kollam, Alappuzha, Vytilla Hub', 'route': 'PKD → EKM', 'dep':'09:30', 'arr':'14:30'},
  {'id':2,price:510,type:'Scania', 'number':'KL-15-BC-5865', 'via':'Attingal, Kollam, Kayamkulam, Alappuzha', 'route': 'PKD → EKM', 'dep':'10:00', 'arr':'15:00'},
  {'id':3,price:280,type:'Super Fast', 'number':'KL-15-AE-0108', 'via':'Kollam, Alappuzha, Vytilla Hub', 'route': 'PKD → EKM', 'dep':'10:30', 'arr':'15:30'},
  {'id':4,price:510,type:'Scania', 'number':'KL-15-BA-1538', 'via':'Attingal, Kollam, Kayamkulam, Alappuzha', 'route': 'PKD → EKM', 'dep':'13:30', 'arr':'18:30'},
  {'id':5,price:280,type:'Super Fast', 'number':'KL-15-BB-8763', 'via':'Kollam, Kayamkulam, Alappuzha', 'route': 'PKD → EKM', 'dep':'16:00', 'arr':'21:00'}];

  lstHotels = [{name:'The International Hotel', price:1450, type:'3 Star'},
  {name:'Crown Plaza', price:2600, type:'5 Star'},
  {name:'Taj Vivanta', price:2200, type:'5 Star'},
  {name:'Taj Malabar', price:2600, type:'5 Star'},
  {name:'Travancore Court', price:1800, type:'3 Star'}];

  blnHotel = false;


  constructor(public navCtrl: NavController, public speech: SpeechRecognition, private zone: NgZone, private toast: Toast, private tts: TextToSpeech, public alertCtrl: AlertController) {
    this.getPermission();

    this.tts.speak('Hello Arun, How can i help you?')
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

  async hasPermission():Promise<boolean> {
    try {
      const permission = await this.speech.hasPermission();
      console.log(permission);

      return permission;
    } catch(e) {
      console.log(e);
    }
  }

  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {
      console.log(e);
    }
  }

  listen(): void {
    console.log('listen action triggered');
    if (this.isListening) {
      this.speech.stopListening();
      this.toggleListenMode();
      return;
    }

    this.toggleListenMode();
    // let _this = this;

    this.speech.startListening()
      .subscribe(matches => {
        this.zone.run(() => {
          // _this.matches = matches;

          // this.toast.show(matches[0], '5000', 'center').subscribe(
          //   toast => {
          //     console.log(toast);
          //   }
          // );
           if(matches[0].toLowerCase().indexOf('time') != -1){
             this.blnBuslist = false;
             this.blnHotel = false;
            this.tts.speak('Sorry Arun,the bus is late by fifteen minutes. There is a canteen near the bus stand. You can have breakfast from there')
          .then(() => {})
          .catch((reason: any) => console.log(reason));

          }
        else if (matches[0].toLowerCase().indexOf('bus') != -1){
            this.blnBuslist = true;
            this.blnHotel = false;
            this.tts.speak('Do you want to book the same bus that you had booked on January 23?')
          .then(() => {})
          .catch((reason: any) => console.log(reason));

          }
          else if(matches[0].toLowerCase().indexOf('hotel') != -1){
            this.blnBuslist = false;
            this.blnHotel = true;
            this.tts.speak('Here are the list of hotels available. Please choose one.')
          .then(() => {})
          .catch((reason: any) => console.log(reason));

          }
          else if(matches[0].toLowerCase().indexOf('yes') != -1){
            this.blnBuslist = false;
            this.blnHotel = false;
            this.tts.speak('How many days are you going to spent in Ernakulam?')
          .then(() => {})
          .catch((reason: any) => console.log(reason));

          }
          else if(matches[0].toLowerCase().indexOf('days') != -1){
            this.blnBuslist = false;
            this.blnHotel = false;
            this.tts.speak('Arun, I think you have missed a hotel booking.')
          .then(() => {})
          .catch((reason: any) => console.log(reason));

          }

          else if(matches[0].toLowerCase().indexOf('crown') != -1){
            this.blnBuslist = false;
            this.blnHotel = false;
            let alert = this.alertCtrl.create({
                title: 'Booked!',
                subTitle: 'Your ticket from Trivandrum to Ernakulam has been booked. Booking number is 125489.',
                buttons: ['OK']
              });
              alert.present();

            this.tts.speak('Ok, Your bus and hotel booking have been done. Ticket number is 1 2 5 4 8 9. The bus will be arriving on 9 O clock at Trivandrum. Wish you a happy journey.')
          .then(() => {})
          .catch((reason: any) => console.log(reason));

          }

          else{
            this.blnBuslist = false;
            this.blnHotel = false;
            this.tts.speak('Sorry, I could not recognize. Please try again.')
          .then(() => {})
          .catch((reason: any) => console.log(reason));
          }

          this.speech.stopListening();
          this.toggleListenMode();
        })
      }, error => console.error(error));

  }

  toggleListenMode():void {
    this.isListening = this.isListening ? false : true;
    console.log('listening mode is now : ' + this.isListening);
  }

}
