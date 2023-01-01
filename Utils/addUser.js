module.exports = async function (data, db) {

    const doc = db.collection('Students').doc(data['User']);


    await doc.set({
        'Adm. No.': data['Adm. No.'],
        'Name': data['Name'],
        'Class': data['Class'],
        'Section': data['Section'],
        'House': data['House']
    }, { merge: true })

}
