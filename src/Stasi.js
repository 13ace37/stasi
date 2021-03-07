const { Client } = require("discord.js");
const { Command, TimeStamp, SoundDuration } = require("./Util");

module.exports = class Stasi {

	constructor(token, settings) {

		this.log = (msg) => {console.log(TimeStamp(),`#${this.logID} - ${msg}`); this.logID++};
		this.logID = 1;

		this.Client = new Client();
		if (token) this.Client.login(token);
		else process.exit();

		this.Client.on("ready", () => {
			this.log("MAIN ~ bot connected to discord");
			this.log("SETTINGS ~ fetching...");
			this.fetchSettings(settings);
			this.log("COMMANDS ~ fetching...");
			this.createCommands();
		});
		this.Client.on("message", message => {
			this.handleMessage(message);
		});

		this.Client.voiceJoinYT = yt => {
			let ytdl = require("ytdl-core");
			if (this.Client.playingSound || !ytdl.validateURL(yt)) return;
			this.log(`SOUNDS ~ playing yt: ${yt}`);
			this.Client.playingSound = true;
			let channel = this.Client.channels.cache.get(this.Client.settings.voiceChannel);
			channel.join().then((c) => {
				try {
					c.play(ytdl(yt), { volume: 0.5 });
					ytdl.getBasicInfo(yt).then(i=> {
						this.log(`SOUNDS ~ playing yt: ${i.videoDetails.title}`);
						setTimeout(() => {channel.leave(); this.Client.playingSound = false;}, i.videoDetails.lengthSeconds * 1000);
					});
				} catch(e) {
					this.log(`SOUNDS ~ yt error: ${e}`);
					this.Client.playingSound = false;
					return channel.leave();
				}
			});
		} 

		this.Client.voiceJoin = sound => {
			if (this.Client.playingSound) return;
			this.log(`SOUNDS ~ playing ${sound}`);
			this.Client.playingSound = true;
			let channel = this.Client.channels.cache.get(this.Client.settings.voiceChannel);
			setTimeout(() => {channel.leave(); this.Client.playingSound = false;}, SoundDuration(sound));
			channel.join().then((c) => {c.play(__dirname+ `/sounds/${sound}.mp3`);});
		}

	}


	fetchSettings(settings) {

		if (settings.nickname) this.Client.guilds.cache.first().members.cache.get(this.Client.user.id).edit({
			nick: settings.nickname
		});
		this.Client.user.setPresence({
			activity: {
				name: settings.activity || "",
				type: "LISTENING"
			},
			status: settings.status || "online"
		})

		this.Client.settings = settings;
		this.log("SETTINGS ~ fetched");

	}

	handleMessage(message) {

		if (message.author.bot) return;
		if (message.channel.type === "dm") return message.channel.send(this.genBTCKey());

		let prefix = this.Client.settings.prefix || ".";
		this.Client.prefix = prefix;

		if (!message.content.startsWith(prefix)) return;

		let command = message.content.split(" ")[0].toLowerCase().slice(prefix.length);
		let args = message.content.split(" ").slice(1);

		if (this.Client.commands[command]) new this.Client.commands[command](message, args, this.Client).run();

	}

	createCommands() { // export this into a config file -> commands.js


		this.Client.commands = {

			rgey: class extends Command {
				run() {this.Client.voiceJoin("aol")}
			},
			suck: class extends Command {
				run() {this.reply("sucks")}
			},
			momgey: class extends Command {
				run() {this.Client.voiceJoin("yaah")}
			},
			weeb: class extends Command {
				run() {this.Client.voiceJoin("yamete")}
			},
			ben: class extends Command {
				run() {this.Client.voiceJoin("ben")}
			},
			nokia: class extends Command {
				run() {this.Client.voiceJoin("nokia")}
			},
			orange: class extends Command {
				run() {this.Client.voiceJoin("orange")}
			},
			crona: class extends Command {
				run() {this.Client.voiceJoin("crona")}
			},
			yt: class extends Command {
				run() {this.Client.voiceJoinYT(this.args[0])}
			},
			stop: class extends Command {
				run() {if (this.Client.playingSound) this.Client.channels.cache.get(this.Client.settings.voiceChannel).leave(); this.Client.playingSound = false;}
			},

		}

		this.log("COMMANDS ~ fetched");

	}

	genBTCKey() {
		let result = '';
		let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < 64; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return `\`${result}\``;
	}
}
