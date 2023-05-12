const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const { userCheck } = require('../../../backend/firestore/utility/user_check');
const { getPlayer } = require('../../../backend/firestore/player/get_player');
const { getLoans } = require('../../../backend/firestore/player/get_loans');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loans')
		.setDescription("Let's make some fake money!"),
	async execute(interaction) {
		const user = interaction.user;

		if(!await userCheck(user)) {
			return interaction.reply("Broke boy doesn't own a business, try /start");
		}

		const player = await getPlayer(user);
        const availableLoans = await getLoans(player);

        const loansEmbed = new EmbedBuilder()
            .setTitle(`${player.business.name}`)
            .setDescription("Available Loans:")
            availableLoans.forEach(loan => {
                loansEmbed
                    .addFields({ name: `${loan.name}`, value: `Loan Amount: ${loan.amt} Owed: x Payback Time: xx`})
            })

        // make that pretty ^^
        // add active loans embed that shows be default with loansEmbed
        // or something idk cuz there gonna be buttons and shit or just show
        // active loans in same embed idek
		return interaction.reply({ embeds: [loansEmbed] });
	},
};