const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
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

        const loanSelect = new StringSelectMenuBuilder()
        .setCustomId('loanID')
        .setPlaceholder('Take a loan.');

        const activeLoanSelect = new StringSelectMenuBuilder()
        .setCustomId('activeLoanID')
        .setPlaceholder('Pay a loan off.');

        const loansEmbed = new EmbedBuilder()
            .setTitle('Available Loans:');
            //.setDescription("")
            availableLoans.forEach(loan => {
                loanSelect
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`${loan.name}`)
                            .setDescription(`Amount: $${loan.amt} Payback: $${loan.owed} Time: ${loan.timeLimit} ${loan.timeLimit > 1 ? 'days' : 'day'}`)
                            .setValue(`${loan.id}`)
                    );
                })
        
        const isActiveLoans = false;

        const activeEmbed = new EmbedBuilder()
            .setTitle('No Active Loans');

        if(player.activeLoans.length > 0) isActiveLoans = true;

        player.activeLoans.forEach(loan => {
            activeLoanSelect
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${loan}`)
                        .setDescription(`Time Left: xx\nOwed: $xx`)
                        .setValue(`${loan}MAKEID`) //FIX THISSSSS!!!!
                );
        });

        

        const row1 = new ActionRowBuilder()
            .addComponents(loanSelect);

        const row2 = new ActionRowBuilder()
            .addComponents(activeLoanSelect);
        
        const firstReply = {
            components: [row1]
        }

        if(isActiveLoans) {
            firstReply.components.push(row2);
        }
        else {
            firstReply.embeds = [activeEmbed];
        }

		const res = await interaction.reply(firstReply);

        const loanFilter = i => {
            i.user.id === user.id;
        }

        const loanCollector = res.createMessageComponentCollector({
            filter: loanFilter,
            time: 60000
        });


        const loanChoice = 'Error: Contact the boss and call him "The Boss"';
        // needs timeout text and cancel option
        loanCollector.on('collect', async selectInt => {
            console.log(selectInt.values[0]);
            const loanChoice = selectInt.values[0];
            loanCollector.stop();
        })

        loanCollector.on('end', async () => {
            console.log('end');
            await res.edit({
                content: `${loanChoice}`,
                embeds: [],
                components: []
                });
        })
	},
};