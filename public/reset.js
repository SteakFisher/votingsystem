const codes = {
    200: 'alert-success',
    403: 'alert-danger',
    500: 'alert-warning'
}
const genRandomString = (len) => {
    let result = ""
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < len; i++) {
        result += str.charAt(Math.floor(Math.random() * str.length))
    }
    return result
}
const conText = () => {
    const mark = document.querySelector('mark')
    mark.innerText = genRandomString(15)
}
const alertBox = (code, msg) => {
    const div = document.createElement('div')
    div.classList.add('alert', codes[code])
    div.innerText = msg
    return alertBox
}
const reset = async (button) => {
    const mark = document.querySelector('mark')
    const confirmText = document.querySelector('#confirmText')

    if (confirmText.value != mark.innerText) return confirmText.classList.add('is-invalid')

    button.remove()
    const res = await fetch('/admin/reset', {
        method: 'DELETE',
        body: {
            state: sessionStorage.state
        }
    })
    const data = res.text()
    const alert = alertBox(res.status, data)
    const alertrow = document.querySelector('#alert-msg')
    alertrow.appendChild(alert)
}