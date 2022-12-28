module.exports = {
    getHouse: async function (email, db) {
        let split = email.split('@')[0].toUpperCase();
        try {
            let doc = await db.doc(`Students/${split}`);
            let data = await doc.get();

            return data.data()['House'];
        }
        catch (e) {
            throw new Error("User doesn't exist");
        }
    }
}
