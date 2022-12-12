import {FieldValue} from "firebase-admin/firestore";

export default async function addVote(house, contestant, user, db, voted) {
    let doc = await db.doc(`Houses/${house}`);
    let data = {}

    data[contestant] = [user.email]

    await doc.set(data, {merge: true});

    data = {}
    data[`${contestant} count`] = FieldValue.increment(1)

    await doc.update(data, {merge: true});

    voted.push(user.email);
}