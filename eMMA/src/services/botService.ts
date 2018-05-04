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
			return value;
		}).then(value => {
			let url = value.toString();
			this.bot.loadFile(url, loadingDone, loadingError);

			function loadingDone(batchNumber) {
				console.log('Bot ready!');
			};

			function loadingError(error, batchNumber) {
				console.error("Loading error: " + error);
			};
		}).then(value => {
			this.bot.sortReplies();
			this.ready = true;
		});
	}

	getData() {
		return new Promise((resolve, reject) => {
			this.http.get('./assets/brain/german-1.rive')
			.toPromise()
			.then(res => {
				resolve(res.url);
			});
		});
	}


	retrieveBotAnswer(request) {
		return (this.bot && this.ready)
			? this.bot.reply("localuser", request)
			: "ERR: Bot Not Ready Yet";
	}

}
