module.exports = {
    resetDb: async function (db) {
        let arr = ['Jupiter', 'Mars', 'Saturn', 'Neptune']

        for (let i = 0; i < arr.length; i++) {
            let doc = await db.doc(`Houses/${arr[i]}`);

            await doc.delete();

            await doc.set({
                'contestant A': [],
                'contestant B': [],
                'contestant A count': 0,
                'contestant B count': 0
            }, {merge: true});
        }
    }
}
