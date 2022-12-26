module.exports = {
    addUser: async function (data, db) {
        let doc = await db.doc(`Students/Mail`);
        let user = {}
        user[data['User']] = {
            'Adm. No.': data['Adm. No.'],
            'Name': data['Name'],
            'Class': data['Class'],
            'Section': data['Section'],
            'House': data['House']
        }

        await doc.set(user, { merge: true });
    }
}