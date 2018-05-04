import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import RiveScript from 'rivescript';

@Injectable()
export class BotService{
	bot: RiveScript;
	opts: any;
	ready: boolean;
	http: Http;

	constructor(private h: Http) {
		this.http = h;
		this.ready = false;

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
		this.getData().then(function(value) {
			return value
		}).then(data => {
			let url = data.toString();
			this.bot.loadFile(url, this.loadingDone, this.loadingError);
		});
	}

	getData() {
		return new Promise((resolve, reject) => {
			this.http.get('./assets/brain/german-1.rive')
			.toPromise()
			.then(res => { resolve(res.url); });
		});
	}

	loadingDone(batchNumber) {
		console.log('Bot ready!');
	  	this.bot.sortReplies();
	  	this.ready = true;
	}

	loadingError(error, batchNumber) {
	  	console.error("Loading error: " + error);
	}

	retrieveBotAnswer(request) {
		return (this.bot && (this.bot as any).ready)
			? this.bot.reply("localuser", request)
			: "ERR: Bot Not Ready Yet";
	}

}
