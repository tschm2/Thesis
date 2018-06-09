import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import RiveScript from 'rivescript';
import { FileController } from '../services/fileController';

@Injectable()
export class BotService{
	bot: RiveScript;
	fileController: FileController;
	opts: any;
	ready: boolean;
	http: Http;

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

	init(){
		this.getData().then(value => {
			let url = value.toString();
			this.bot.loadFile(url, loadingDone, loadingError);

			// OK, this can probably be done better - but it works for the moment ;-)
			let baseUrl = url.substr(0, url.length-9);
			this.bot.loadFile(baseUrl + 'german.rive', loadingDone, loadingError);
			if((<any>window).cordova){ // if cordova is available, we can load the written file
				// TODO:
				// load generated file with fileController
						this.bot.loadFile('generated.rive', loadingDone, loadingError);
						alert('file read');

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

	generateFile(qh, storage){
		var fileString = "// the event triggering variables - generated dynamically from the questionHandler messageEMMA object";
		var name = "";
		var medications = "";

		for(var prop in qh.messageEMMA){
			if(!Array.isArray(qh.messageEMMA[prop])){
				fileString += "\n! var " + prop + " = " + qh.messageEMMA[prop];
			}
		}

		if(!this.fileController.checkDirectory("brain")) {
			this.fileController.createDirectory("brain");
			console.log("directory brain created");
		} else {
			console.log("directory brain has already been created, dawg");
		}

		Promise.all([storage.get('name'),storage.get('medicationData'),this.ready]).then(values=>{
			name = "! var username = " + values[0];

			medications = "! var medications = ";
			for(var med in values[1]){
				medications += values[1][med].title.toLowerCase() + '|';
			}
			medications = medications.substring(0, medications.length - 1);
			fileString += "\n\n" + name + "\n\n" + medications + "\n\n//pattern for testing successful loading of the file\n+ razulpatuff \n- sagte das Känguru";

			this.fileController.writeFile('generated.rive', fileString)
			.then(success => {
				this.fileController.readFile('generated.rive');
				this.bot.loadFile(this.fileController.getPath() + 'generated.rive', x=>{alert('generated file loaded: ' + x)}, x=>{alert('some error occured')});
			})
			.catch(error => {
				console.log('there was an error: ' + error);
			});

		});
	}

}
