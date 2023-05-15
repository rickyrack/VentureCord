const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { userCheck } = require('../../../backend/firestore/utility/user_check');
const { getPlayer } = require('../../../backend/firestore/player/get_player');
const { getLoans } = require('../../../backend/firestore/player/get_loans');
const { applyLoan } = require('../../../backend/firestore/utility/apply_loan');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loans')
		.setDescription("Let's make some fake money!"),
	async execute(interaction) {
		const user = interaction.user;

		if(!await userCheck(user)) {
			return interaction.reply("Broke boy doesn't own a business, try /start");
		}

		user.player = await getPlayer(user);
        const availableLoans = await getLoans(user);

        const loanSelect = new StringSelectMenuBuilder()
        .setCustomId('availableLoanID')
        .setPlaceholder('Take a loan.');

        const activeLoanSelect = new StringSelectMenuBuilder()
        .setCustomId('activeLoanID')
        .setPlaceholder('Pay a loan off.');

        /*const loansEmbed = new EmbedBuilder()
            .setTitle('Available Loans:');
            //.setDescription("")*/
        
            availableLoans.forEach(loan => {
                loanSelect
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`${loan.name}`)
                            .setDescription(`Amount: $${loan.amt} Payback: $${loan.owed} Time: ${loan.timeLimit} ${loan.timeLimit > 1 ? 'days' : 'day'}`)
                            .setValue(`${loan.id}`)
                    );
                })

        let isActiveLoans = false;
        let isAvailableLoans = false;

        const activeEmbed = new EmbedBuilder()
            .setTitle('No Active Loans');

        const availableEmbed = new EmbedBuilder()
            .setTitle('No Available Loans');

        if(availableLoans.length > 0) isAvailableLoans = true;
        if(user.player.activeLoans.length > 0) isActiveLoans = true;

        user.player.activeLoans.forEach(loan => {
            activeLoanSelect
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${loan.name}`)
                        .setDescription(`Time Left: xx\nOwed: $xx`)
                        .setValue(`${loan.id}`)
                );
        });

        const row1 = new ActionRowBuilder()
            .addComponents(loanSelect);

        const row2 = new ActionRowBuilder()
            .addComponents(activeLoanSelect);
        
        // init firstReply
        const firstReply = {
            components: [],
            embeds: []
        }

        // adds available loans if they exist or adds no available loans embed
        if(isAvailableLoans) {
            firstReply.components.push(row1);
        }
        else {
            firstReply.embeds.push(availableEmbed);
        }


        // adds active loans if they exist or adds no active loans embed
        if(isActiveLoans) {
            firstReply.components.push(row2);
        }
        else {
            firstReply.embeds.push(activeEmbed);
        }

		const res = await interaction.reply(firstReply);

        const loanFilter = i => {
            return i.user.id == user.id;
        }

        const loanCollector = res.createMessageComponentCollector({
            filter: loanFilter,
            time: 60000
        });

        // this is defaulted to error message
        let loanChoice = 'Error: Contact the boss and call him "The Boss"';
        // needs cancel option and checks if any loans expired
        loanCollector.on('collect', async selectInt => {
            loanChoice = selectInt.values[0];
            loanCollector.stop(false);
        })

        loanCollector.on('end', async (collected, reason) => {
            console.log(collected);
            if(reason === 'time') {
                await res.edit({
                    content: "The loan office doesn't have all day",
                    embeds: [],
                    components: []
                })
            }

            if(collected.customId === 'availableLoanID') {
                const loanData = availableLoans.find(loan => loan.id === loanChoice);
                if(!await applyLoan(loanData, user)) {
                    await res.edit({
                        content: 'Error: Contact the boss and call him "The Boss"',
                        embeds: [],
                        components: []
                        });
                }
            }
            else if(collected.customId === 'activeLoanID') {

            }

            // make the reply a variable based on available or active
            await res.edit({
                content: `${loanData.name} will be credited to your account. Check your active loans!`,
                embeds: [],
                components: []
                });
        })
	},
};