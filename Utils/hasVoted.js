module.exports = {
    hasVoted: async function (user, voted, db) {
        if (voted.length === 0) {
            let arr = ['Jupiter', 'Mars', 'Saturn', 'Neptune']

            for (let i = 0; i < arr.length; i++) {
                let doc = await db.doc(`Houses/${arr[i]}`);

                let data = await doc.get();

                let contestantA = data.get('contestant A');
                let contestantB = data.get('contestant B');

                voted.push(...contestantA);
                voted.push(...contestantB);
            }
        }

        if (voted.includes(user.email)) {
            return true;
        } else {
            return false;
        }
    }
}