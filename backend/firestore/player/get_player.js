const { doc, getDoc } = require("firebase/firestore")
const { db } = require("../../firebase-config")

const getPlayer = async (user) => {
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) return false;

    return userSnap.data();
}

module.exports = { getPlayer };