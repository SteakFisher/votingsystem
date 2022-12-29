module.exports = {
    getHouse: async function (email, db) {
        let split = email.split('@')[0].toUpperCase();
        try {
            let doc = await db.doc(`Students/${split}`);
            let data = await doc.get();
            if (house == 'undefined') throw new Error('House not saved for this user')
            return data.data()['House'];
        }
        catch (e) {
            throw new Error("User doesn't exist");
        }
    }
}
