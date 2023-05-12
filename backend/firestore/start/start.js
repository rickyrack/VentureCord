const { doc, setDoc, getDoc } = require("@firebase/firestore");
const { db } = require("../../firebase-config")

const start = async (user, businessName) => {
    const userRef = doc(db, 'users', user.id);

    const date = new Date();
    await setDoc(userRef, {
        created: date.toLocaleDateString(),
        id: user.id,
        username: user.username,
        rank: 'player',
        business: {
            name: businessName,
            type: 'LemonadeStand',
            employees: 0,
            shares: 100,
            totalFunds: 0
        },
        activeLoans: []
    })
}

module.exports = { start };