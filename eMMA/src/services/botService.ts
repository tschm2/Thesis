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
		let url = this.getData();
		this.opts = {
			debug: true,
			utf8: true,
			watch: false,
			brain: url
		};
		this.bot = new RiveScript({
			debug: this.opts.debug,
			utf8: this.opts.utf8,
			concat: "newline",
		});
		(this.bot as any).ready = false;
		console.log('loading bot');
		console.log(this.opts.brain);
		this.bot.loadFile(this.opts.brain, this.loadingDone, this.loadingError);
	}

	getData() {
		var url;
		this.http.get('./assets/brain/german-1.rive')
			.map(res => {
				console.log('map function');
				console.log(res);
				console.log(res.url);
				url = res.url;
				return res.url;
			})
			.subscribe(res => {
				console.log("res here");
				console.log(res);
				return res;
			});
		// FIXME: already called in the beginning, should be the last step
		// Work with promises in next commit
		console.log("FINAL GETDATA RESULT " + url);
		return url;
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
