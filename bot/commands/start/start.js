const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const { start } = require('../../../backend/firestore/start/start');
const { userCheck } = require('../../../backend/firestore/utility/user_check');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription("Let's make some fake money!")
		.addStringOption(option => 
			option.setName('name')
				.setDescription('What is your business called?')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.user;
		const businessName = interaction.options.getString('name');

		if(await userCheck(user)) {
			return interaction.reply('You cannot "/start" again, try /help')
		}

		console.log(businessName);
		await start(user, businessName);

        const startEmbed = new EmbedBuilder()
            .setTitle(`${businessName}`)
            .setDescription("Venture Cord welcomes your small shitty business! Try /stats")
            .setImage("https://i.imgur.com/ni6haZ5.png")
		return interaction.reply({ embeds: [startEmbed] });
	},
};