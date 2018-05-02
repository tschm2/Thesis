import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import RiveScript from 'rivescript';

@Injectable()
export class BotService{
	opts: any;
	bot: RiveScript;
	http: Http;

	constructor(private h: Http) {
		this.http = h;
	}

	init(){
		let testi = this.getData();
		console.log('asdf');
		console.log(testi);
		this.opts = {
			debug: true,
			utf8: true,
			watch: false,
			brain: testi
		};
		this.bot = new RiveScript({
			debug: this.opts.debug,
			utf8: this.opts.utf8,
			concat: "newline",
		});
		(this.bot as any).ready = false;
		console.log('loading bot');
		this.bot.loadFile(this.opts.brain, this.loadingDone, this.loadingError);
	}

	getData() {
		let response = this.http.get('./assets/brain/german-1.rive')
			.map(res => {
				console.log('map function');
				console.log(res);
			})
			.subscribe(res => {
				console.log('subscribe function');
				console.log(res);
			});
		return response;
	}

	loadingDone(batchNumber) {
		console.log('Bot ready!');
	  	this.bot.sortReplies();
	  	(this.bot as any).ready = true;
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
