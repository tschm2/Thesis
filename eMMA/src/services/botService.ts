import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import RiveScript from 'rivescript';
import { FileController } from '../services/fileController';
import { Storage } from '@ionic/storage';

@Injectable()
export class BotService{
	bot: RiveScript;
	fileController: FileController;
	opts: any;
	ready: boolean;
	http: Http;
	storage: Storage;
	qh: any;
	emma: any;


	constructor(private h: Http, private fc: FileController) {
		this.http = h;
		this.ready = false;
		this.fileController = fc;

		this.opts = {
			debug: false,
			utf8: true,
			watch: false
		};
		this.bot = new RiveScript({
			debug: this.opts.debug,
			utf8: this.opts.utf8,
			concat: "newline"
		});
		console.log(this.bot);
	}
	set(emma, storage){
		this.emma = emma;
		this.storage = storage;
	}
	init(){
		console.log('init botService');
		this.getData().then(value => {
			let url = value.toString();
			this.bot.loadFile(url, loadingDone, loadingError);

			// OK, this can probably be done better - but it works for the moment ;-)
			let baseUrl = url.substr(0, url.length-9);
			this.bot.loadFile(baseUrl + 'spezi.rive', loadingDone, loadingError);
			this.bot.loadFile(baseUrl + 'german.rive', loadingDone, loadingError);

			if((<any>window).cordova){ // if cordova is available, we can load the written file
				this.generateAndLoadFile();
			}
			else{ // if we developing on a non cordova machine (ionic serve), we use the fallback file
				console.log('no cordova available, use fallback file /assets/medication.rive');
				this.bot.loadFile(baseUrl + 'medication.rive', loadingDone, loadingError);
			}

			function loadingDone(batchNumber) {
				console.log('File loaded! (' + batchNumber + ')');
			};

			function loadingError(error, batchNumber) {
			console.log("Loading error: " + error);
			};
		}).catch(error => {
			console.log("ERROR: " + error);
		});
	}

	getData() {
		return new Promise((resolve, reject) => {
 			this.http.get('./assets/brain/emma.rive')
				.toPromise()
				.then(res => {
					resolve(res.url);
				}).catch(error => {
					console.log("ERROR: " + error);
				});
		});
	}

	setUservar(name, value) {
		this.bot.setUservar("localuser", name, value);
		console.log(this.getUservar(name));
	}

	getUservar(name) {
		let uservar = this.bot.getUservar("localuser", name);
		console.log('got user name: '+uservar);
		return uservar;
	}

	retrieveBotAnswer(request) {
		if(!this.ready) {
			this.bot.sortReplies();
			this.ready = true;
		}
		return (this.bot && this.ready)
			? this.bot.reply("localuser", request)
			: "ERR: Bot Not Ready Yet";
	}

	generateAndLoadFile(){
		var fileString = "! version = 2.0\n";
		var name = "";
		var medications = "";
		var doctor = "";

		for(var prop in this.emma.messageEMMA){
			if(!Array.isArray(this.emma.messageEMMA[prop])){
				fileString += "\n! var " + prop + " = " + this.emma.messageEMMA[prop];
			}
		}
		Promise.all([this.storage.get('name'),this.storage.get('medicationData'),this.storage.get('doctor'),this.ready]).then(values=>{
			name = "! var username = " + values[0];
			if(values[2] != null){
				doctor = "! var doctor = " + values[2];
			}

			medications = "! array medication = ";
			if(values[1].length > 0){
				for(var med in values[1]){
					medications += values[1][med].title.toLowerCase() + '|';
				}
				medications = medications.substring(0, medications.length - 1);
			}
			else {
				// we have to write something, since the bot wont work properly if this
				// array is empty. since it's gibberish, it will probably never be triggered.
				// (and it's overwritten as soon as any medication is added)
				medications += 'sd12sf4d44d|43546sdf4e542d4';

			}
			fileString += "\n\n" + name +
										"\n" + doctor +
										"\n\n" + medications;

			this.fileController.writeFile('generated.rive', fileString)
			.then(success => {
				this.bot.loadFile(this.fileController.getPath() + 'generated.rive', x=>{console.log('generated file loaded: ' + x)}, x=>{console.log('some error occured')});
			})
			.catch(error => {
				alert('there was an error: ' + error);
			});

		});
	}

}
