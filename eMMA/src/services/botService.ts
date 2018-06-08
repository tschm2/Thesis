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
			debug: true,
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
			let baseUrl = url.substr(0, url.length-15);
			this.bot.loadFile(baseUrl + 'emma.rive', loadingDone, loadingError);
			this.bot.loadFile(baseUrl + 'german-1.rive', loadingDone, loadingError);

			function loadingDone(batchNumber) {
				console.log('Bot ready!');
			};

			function loadingError(error, batchNumber) {
				console.error("Loading error: " + error);
			};
		}).catch(error => {
			console.log("ERROR: " + error);
		});
	}

	getData() {
		return new Promise((resolve, reject) => {
 			this.http.get('./assets/brain/medication.rive')
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
		console.log(uservar);
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
			alert("directory brain created");
		} else {
			alert("directory brain has already been created, dawg");
		}

		console.log("we're right above the Promise");
		Promise.all([storage.get('name'),storage.get('medicationData'),this.ready]).then(values=>{
			console.log("we're inside the Promise now");
			name = "! var username = " + values[0];

			medications = "! var medications = ";
			for(var med in values[1]){
				medications += values[1][med].title.toLowerCase() + '|';
			}
			medications = medications.substring(0, medications.length - 1);
			fileString += "\n\n" + name + "\n\n" + medications;

			this.fileController.createDirectory('brain');
			this.fileController.writeFile('test.txt', fileString);
			alert("file created : " + fileString);
		});
	}

}
