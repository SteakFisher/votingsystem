module.exports = {
    structureData: function (usernames, houses) {
        let final = []
        let errors = []

        for(let i = 0; i < usernames.length; i++){
            for(let j = 0; j < houses.length; j++){
                if(String(usernames[i]['Adm. No.']) === houses[j]['Adm. No.']){
                    if(usernames[i]['User'] === undefined){
                        errors.push(usernames[i])
                        continue
                    }

                    let data = {
                        'Adm. No.': usernames[i]['Adm. No.'],
                        'Name': usernames[i]['Name'],
                        'Class': usernames[i]['Class'],
                        'Section': usernames[i]['Section'],
                        'User': usernames[i]['User'],
                        'House': houses[j]['House']
                    }

                    for(const key in data){
                        if(data[key] === undefined){
                            errors.push(data)
                            break;
                        }
                    }

                    final.push(data)
                }
            }
        }

        return [final, errors]
    }
}