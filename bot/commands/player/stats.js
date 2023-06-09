const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const { userCheck } = require('../../../backend/firestore/utility/user_check');
const { getPlayer } = require('../../../backend/firestore/player/get_player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription("Let's make some fake money!"),
	async execute(interaction) {
		const user = interaction.user;

		if(!await userCheck(user)) {
			return interaction.reply("Broke boy doesn't own a business, try /start");
		}

		user.player = await getPlayer(user);

        const statsEmbed = new EmbedBuilder()
            .setTitle(`${user.player.business.name}`)
            .setDescription("Not bad, not great.")
            .addFields(
                { name: 'Total Funds:', value: `$${user.player.business.totalFunds}` },
                { name: 'Employees:', value: `${user.player.business.employees}` },
                { name: 'Shares:', value: `${user.player.business.shares}%`}
            )
		return interaction.reply({ embeds: [statsEmbed] });
	},
};