var fixTime = number => {
	if (number < 10) number = '0' + number;
	return number;
}

var formatAMPM = (date = new Date()) => {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour "0" should be "12"
	return fixTime(hours) + ":" + fixTime(minutes) + ":" + fixTime(seconds) + " " + ampm;
}

module.exports = {
	SoundDuration: (file) => {
		return require("get-mp3-duration")(require("fs").readFileSync(__dirname + `/sounds/${file}.mp3`)) + 1000;
	},
	TimeStamp: (inDate) => {
		if (!inDate) inDate = new Date();
		if (!(inDate instanceof Date)) inDate = new Date();
		return `[${fixTime(inDate.getMonth() + 1)}/${fixTime(inDate.getDate())}/${fixTime(inDate.getFullYear())}] [${formatAMPM(inDate)}]`;
	},
	Command: class Command {

		constructor(message, args, Client) {

			this.Client = Client;
			this.message = message;
			this.args = args;

		}

		send(msg, permission = false) {
			if (this.validatePermissions(permission)) this.message.channel.send(msg);
		}

		reply(msg, permission = false) {
			if (this.validatePermissions(permission)) this.message.reply(msg);
		}

		validatePermissions(permission) {
			return (this.message.member && permission ? this.message.member.hasPermission(permission) : true)
		}

	}
};