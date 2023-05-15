const { doc, getDoc, updateDoc, arrayUnion } = require("firebase/firestore");
const { db } = require("../../firebase-config");

const applyLoan = async (loanData, user) => {
    console.log('here')
    console.log(loanData);
    const userRef = doc(db, 'users', user.id)
    //const userSnap = await getDoc(userRef);

    //const loanRef = doc(db, 'loans', loanID);
    //const loanSnap = await getDoc(loanRef);
    await updateDoc(userRef, {
        activeLoans: arrayUnion(loanData)
    })

    return true;
}

module.exports = { applyLoan }