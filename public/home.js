// fetch the link as the button is loaded

const hex = {
    Jupiter: '#0000FF',
    Mars: '#D60301',
    Saturn: '#DE790A',
    Neptune: '#228B22',
}

const house = (button) => {
    const house = button.id
    const previous = document.querySelector('.selected')
    previous.classList.remove('selected')
    button.classList.add('selected')
    document.querySelector('#left-bg').style.backgroundColor = `${hex[house]}`
    document.querySelector('#right-bg').style.background = `linear-gradient(45deg, black, ${hex[house]})`


}
const login = async () => {
    const state = Math.floor(Math.random() * 9999999)
    sessionStorage.state = state
    const { url } = await (
        await fetch(`/getLink?state=${state}`)
    ).json()
    location = url
}
