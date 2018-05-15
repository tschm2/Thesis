import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import RiveScript from 'rivescript';

@Injectable()
export class BotService{
	opts: any;
	bot: RiveScript;
	http: Http;

	constructor() { }

	init(){
		this.opts = {
			debug: true,
			utf8: true,
			watch: false,
			brain: this.getData
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
		return this.http.get('./assets/brain/german.rive')
			.subscribe((res: Response) => res.text());
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
