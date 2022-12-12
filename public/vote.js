const enable = () => {
    const button = document.getElementById('submit')
    button.disabled = false
}
const submit = () => {
    const form = document.getElementsByTagName('form')[0]

    console.log(form)
}