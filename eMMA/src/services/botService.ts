import RiveScript from 'rivescript';

export class BotService{
	opts: any;
	bot: RiveScript;
	constructor() { }

	init(){
		this.opts = {
			debug: false,
			utf8: false,
			watch: false,
			brain: './brain/german-1.rive'
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
