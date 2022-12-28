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
        formdata.append('usernames', usernames.files[0], usernames.files[0].name)
        formdata.append('houselist', houselist.files[0], houselist.files[0].name)
        formdata.append('state', sessionStorage.state)
        button.remove()
        const res = await fetch('/admin/house', {
            method: "POST",
            body: formdata
        })
        const { msg, errors } = await res.json()
        const alertDiv = createAlertDiv(msg, res.status)
        const stateDiv = document.getElementById('state')
        stateDiv.appendChild(alertDiv)
        if (errors) {
            const errorsDiv = createAlertDiv(`Errors:${errors.toString()}`, 500)
            state.appendChild(errorsDiv)
        }
    }

}