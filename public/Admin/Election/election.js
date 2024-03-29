const houses = ['Jupiter', 'Saturn', 'Mars', 'Neptune']
const colors = {
    "Jupiter": "primary",
    "Saturn": "warning",
    "Mars": "danger",
    "Neptune": "success"
}
const codes = {
    200: 'alert-success',
    400: 'alert-danger',
    500: 'alert-warning'
}

const createAlertDiv = (msg, code) => {
    const div = document.createElement('div')
    div.classList.add('alert', `${codes[code]}`)
    div.innerText = msg
    return div
}
const addElements = () => {
    const row = document.getElementById('houses')
    for (const house of houses) {
        const col = document.createElement('div')
        col.classList.add('col-2', 'text-center', 'border', `border-${colors[house]}`, 'border-3', 'rounded-5', 'mx-2')
        col.innerHTML = `
        <h1 class="mb-3">${house}</h1>
                <h3>Contestant A</h3>
                <div class="input-group flex-nowrap mb-3">
                    <input class="form-control " type="text" id="${house}_Contestant_A_name"  required placeholder="Contestant Name" aria-label="Username" aria-describedby="addon-wrapping">
                </div>
                <div class="input-group flex-nowrap mb-3">
                    <input class="form-control " type="text" id="${house}_Contestant_A_quote"  required placeholder="Quote" aria-label="Username" aria-describedby="addon-wrapping">
                </div>
                <div class="input-group mb-3">
                    <input class="form-control" type="file" id="${house}_Contestant_A_logo" required accept=".png" aria-describedby="inputGroupFileAddon03" aria-label="Upload">
                </div>

                <h3 class="mt-4">Contestant B</h3>
                <div class="input-group flex-nowrap mb-3">
                    <input class="form-control " type="text" id="${house}_Contestant_B_name"  required placeholder="Contestant Name" aria-label="Username" aria-describedby="addon-wrapping">
                </div>
                <div class="input-group flex-nowrap mb-3">
                    <input class="form-control" type="text" id="${house}_Contestant_B_quote"  required placeholder="Quote" aria-label="Username" aria-describedby="addon-wrapping">
                </div>
                <div class="input-group mb-3">
                    <input class="form-control" type="file" id="${house}_Contestant_B_logo"  required accept=".png"   aria-label="Upload">
                </div>

    `
        row.appendChild(col)
    }
}
const check = (element) => {
    if (element.value || (element.files && element.files[0])) {
        element.classList.remove('is-invalid')
        return true
    }
    else {
        element.classList.add('is-invalid')
        return false
    }
}
const upload = async (button) => {
    const data = new FormData()
    const details = {}
    let error = false
    for (const house of houses) {

        const nameA = document.getElementById(`${house}_Contestant_A_name`)
        const quoteA = document.getElementById(`${house}_Contestant_A_quote`)
        const logoA = document.getElementById(`${house}_Contestant_A_logo`)
        const nameB = document.getElementById(`${house}_Contestant_B_name`)
        const quoteB = document.getElementById(`${house}_Contestant_B_quote`)
        const logoB = document.getElementById(`${house}_Contestant_B_logo`)

        if (!check(nameA)) error = true
        if (!check(nameB)) error = true
        if (!check(quoteA)) error = true
        if (!check(logoA)) error = true
        if (!check(quoteB)) error = true
        if (!check(logoB)) error = true

        if (!error) {
            details[`${house}_Name_A`] = nameA.value
            details[`${house}_Name_B`] = nameB.value
            details[`${house}_Quote_A`] = quoteA.value
            details[`${house}_Quote_B`] = quoteB.value
            data.append(`${house}_Logo_A`, logoA.files[0], `${house}_Contestant_A.png`)
            data.append(`${house}_Logo_B`, logoB.files[0], `${house}_Contestant_B.png`)

        }

    }
    if (error) {
        alert('Fill in all the input boxes ')
    }

    else {
        data.append('details', JSON.stringify(details))
        data.append('state', sessionStorage.state)
        const res = await fetch('/admin/election', {
            method: "POST",
            body: data
        })
        const { msg, errors } = await res.json()
        button.remove()
        const stateDiv = document.getElementById('state')
        const msgDiv = createAlertDiv(msg, res.status)
        stateDiv.appendChild(msgDiv)
        if (errors?.length != 0) {
            errorsDiv = createAlertDiv(errors, 500)
            stateDiv.appendChild(errorsDiv)
        }

    }

}


addElements()

