// fetch the link as the button is loaded

const login = async () => {
    const state = Math.floor(Math.random() * 9999999)
    sessionStorage.state = state
    const { url } = await (await fetch(`/getLink?state=${state}`)).json()
    location = url
}