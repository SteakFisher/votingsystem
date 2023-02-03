const getData = async (filePath) => {
    const buffer = await filePath.arrayBuffer()
    const file = XLSX.readFile(buffer)

    let data = []

    const sheets = file.SheetNames

    for (let i = 0; i < sheets.length; i++) {
        const temp = XLSX.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res)
        })
    }
    return data
}

const structureData = (usernames, houses) => {
    let final = []
    let errors = []

    for (let i = 0; i < usernames.length; i++) {
        for (let j = 0; j < houses.length; j++) {
            if (String(usernames[i]['Adm. No.']) === houses[j]['Adm. No.']) {
                if (usernames[i]['User'] === undefined) {
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

                if (!data['House']) {
                    data['House'] = 'undefined'
                }

                for (const key in data) {
                    if (data[key] === undefined) {
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

const codes = {
    200: 'alert-success',
    401: 'alert-danger',
    500: 'alert-warning'
}
const createAlertDiv = (msg, code) => {
    const div = document.createElement('div')
    div.classList.add('alert', `${codes[code]}`)
    div.innerText = msg
    return div
}

const upload = async (button) => {
    const usernames = document.getElementById('Usernames')
    const houselist = document.getElementById('Houselist')

    let error = false
    for (const element of [usernames, houselist]) {
        if (!element.files[0]) {
            element.classList.add('is-invalid')
            error = true
        }
        else {
            element.classList.remove('is-invalid')
        }
    }
    if (error) {
        alert('Please Upload the Excel file in both fields')
    }
    else {
        const formdata = new FormData()
        const usernamesarr = await getData(usernames.files[0])
        const houselistarr = await getData(houselist.files[0])
        const [students, errors] = await structureData(usernamesarr, houselistarr)

        formdata.append('students', JSON.stringify(students))
        formdata.append('state', sessionStorage.state)
        button.remove()
        const res = await fetch('/admin/house', {
            method: "POST",
            body: formdata
        })
        const { msg } = await res.json()
        const alertDiv = createAlertDiv(msg, res.status)
        const stateDiv = document.getElementById('state')
        stateDiv.appendChild(alertDiv)
        if (errors) {
            const errorsDiv = createAlertDiv(`Errors:${errors.toString()}`, 500)
            state.appendChild(errorsDiv)
        }
    }

}