module.exports = {
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