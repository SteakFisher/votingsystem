
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

const addVote = async (value) => {
    // **INSERT LOADING ANIMATION OR SMTHING**
    // const container = document.querySelector('.container')
    // console.log(container)
    // container.remove()
    const res = await fetch('/addvote', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            state: sessionStorage.state,
            contestant: `contestant ${value}`
        })
    })
}
const submit = () => {
    const button = document.getElementById('submit')
    const choices = document.getElementsByName('choice')
    for (const choice of choices) {
        if (choice.checked) {
            addVote(choice.value)
        }
    }
}

//Code

// Add a check to see if they voted already

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