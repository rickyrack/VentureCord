const { collection, getDocs, doc, getDoc } = require("firebase/firestore")
const { db } = require("../../firebase-config")

const getLoans = async (user) => {
    const player = user.player;

    const loansColl = collection(db, 'loans');
    const loansSnap = await getDocs(loansColl);

    const availableLoans = [];

    // check if player meets requirements for loan and doesnt already have it
    loansSnap.forEach(doc => {
        if(doc.data().minFunds <= player.business.totalFunds) {
            let canAdd = true;
            player.activeLoans.forEach(loan => {
                if(loan.id === doc.data().id) {
                    canAdd = false;
                }
            })
            if(canAdd) availableLoans.push(doc.data());

        }
    })

    return availableLoans;
}

module.exports = { getLoans };