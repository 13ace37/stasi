const { Client } = require("discord.js");
const { Command } = require("./Util");

module.exports = class Stasi {

	constructor(token, settings) {

		this.Client = new Client();
		if (token) this.Client.login(token);
		else process.exit();

		this.Client.on("ready", () => {
			this.fetchSettings(settings);
			this.createCommands();
		});
		this.Client.on("message", message => {
			this.handleMessage(message);
		});

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


		}


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
