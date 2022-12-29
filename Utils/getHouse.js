module.exports = {
    getHouse: async function (email, db) {
        let split = email.split('@')[0].toUpperCase();
        try {

            let doc = await db.doc(`Students/${split}`);
            let data = await doc.get();
            let house = data.data()['House']
            house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase()
            if (house == 'undefined') throw new Error('House not saved for this user')
            return house;
        }
        catch (e) {
            throw new Error("User doesn't exist");
        }
    }
}
