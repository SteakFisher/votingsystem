
const state = sessionStorage.state
if (!state) location = '/home'

const rgbvals = {
    "Jupiter": "0, 0, 255, 0.5",
    "Neptune": "0, 121, 0, 0.5",
    "Mars": "200, 0, 0, 0.5",
    "Saturn": "255, 255, 0, 0.5",

}
const enable = () => {
    const button = document.getElementById('submit')
    button.disabled = false
}

const addVote = (value) => {
    fetch('/addvote', {
        method: "POST",
        body: {
            state: sessionStorage.state,
            contestant: `contestant_${value}`
        }
    })
}
const submit = () => {
    const choices = document.getElementsByName('choice')
    for (const choice of choices) {
        if (choice.checked) {
            addVote(choice.value)
        }
    }
}

//Code

(async () => {

    //Maybe Add a Check to verify that house exist 

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const { house } = await (await fetch(`/getHouse?state=${state}`)).json()

            document.body.style.backgroundImage = `linear-gradient(to bottom,
             rgba(${rgbvals[house]}),
             rgba(${rgbvals[house]})), url('bg.jpg')`

            const elements = document.getElementsByTagName('img')
            for (const el of elements) {
                const contestant = el.parentElement.getAttribute('for')
                el.setAttribute('src', `${house}_Contestant_${contestant}.png`)

            }
        } catch (error) {
            console.log(error)
        }
    })

})()