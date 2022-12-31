module.exports = {
    getVoteData: async function (db) {

        let arr = ['Jupiter', 'Mars', 'Saturn', 'Neptune']
        let ret = {}
        for (let i = 0; i < arr.length; i++) {
            let doc = await db.doc(`Houses/${arr[i]}`).get();
            ret[arr[i]] = doc.data()
        }
        return ret

    }
}