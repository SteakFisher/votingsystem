// fetch the link as the button is loaded

const hex = {
    Jupiter: '#0077ff',
    Mars: '#FF0000',
    Saturn: '#FF8A00',
    Neptune: '#228B22',
}

const house = (button) => {
    const house = button.id
    const previous = document.querySelector('.selected')
    previous.classList.remove('selected')
    button.classList.add('selected')
    document.body.style.background = `conic-gradient(from 180deg at 50% 50%, ${hex[house]} 0deg, #130000 360deg)`


}
const login = async () => {
    const state = Math.floor(Math.random() * 9999999)
    sessionStorage.state = state
    const { url } = await (
        await fetch(`/getLink?state=${state}&redirect=vote`)
    ).json()
    location = url
}
