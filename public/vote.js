// const state = sessionStorage.state
// if (!state) location = '/home'

const hex = {
    Jupiter: '#0000FF',
    Mars: '#FF0000',
    Saturn: '#FF8A00',
    Neptune: '#228B22',
}

const enable = () => {
    document.querySelector('.submit').disabled = false
}

const addVote = async (value) => {

    document.querySelector('.font').remove()  // Remove Submit Text
    document.querySelector('.spinner-border').style = 'display:'

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
const submit = async (button) => {
    const choices = document.getElementsByName('choice')
    for (const choice of choices) {
        if (choice.checked) addVote(choice.value)
    }
}

//Code

// Add a check to see if they voted already

(async () => {

    //Maybe Add a Check to verify that house exist 

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


})()