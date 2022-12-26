module.exports = {
    getHouse: async function (user, db) {
        let doc = await db.doc(`Students/TANISHQ.P1_OOB`);
        let data = await doc.get();

        return data.data()['House'];
    }
}
