const state = sessionStorage.state
if (!state) location = '/'

const submitbutton = `<button class=" rounded-pill px-5 pt-2 text-center submit display-5"  onclick="submit(this)" disabled>
<span class="font">Submit</span></button>`

const hex = {
    Jupiter: '#0000FF',
    Mars: '#FF0000',
    Saturn: '#FF8A00',
    Neptune: '#228B22',
}
const codes = {
    200: 'alert-success',
    403: 'alert-danger',
    500: 'alert-warning'
}

const enable = () => {
    document.querySelector('.submit').disabled = false
}
const createLoadingDiv = () => {
    const div = document.createElement('div')
    div.classList.add('spinner-border', 'text-light')
    div.style = 'width: 3rem; height: 3rem;'
    div.role = 'status'
    return div
}
const createAlertDiv = (msg, code) => {
    const div = document.createElement('div')
    div.classList.add('alert', `${codes[code]}`)
    div.innerText = msg
    return div
}
const addVote = async (value) => {

    const statediv = document.getElementById('state')
    const loadingdiv = statediv.appendChild(createLoadingDiv())

    const res = await fetch('/addvote', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            state: 3242342,
            contestant: `contestant A`
        })
    })
    const msg = await res.text()

    loadingdiv.remove()
    statediv.appendChild(createAlertDiv(msg, res.status))

}
const submit = async (button) => {
    const choices = document.getElementsByName('choice')
    for (const choice of choices) {
        button.remove()
        if (choice.checked) addVote(choice.value)
    }
}

(async () => {

    const statediv = document.getElementById('state')
    const quoteA = document.getElementById('quoteA')
    const quoteB = document.getElementById('quoteB')

    try {
        const res = await fetch(`/getHouse?state=${state}`)
        const data = await res.json()

        if (!data.house) return statediv.appendChild(createAlertDiv(data.error, 403))

        quoteA.innerText = data.quoteA
        quoteB.innerText = data.quoteB
        document.body.style.background = `conic-gradient(from 180deg at 50% 50%, ${hex[data.house]} 0deg, #130000 360deg)`

        const elements = document.getElementsByTagName('img')
        for (const el of elements) {
            const contestant = el.parentElement.getAttribute('for')
            el.setAttribute('src', `./Contestants/${data.house}_Contestant_${contestant}.png`) // have a feeling something is wrong in this idk

        }
        statediv.innerHTML = submitbutton
    } catch (error) {
        console.log(error)
    }


})()