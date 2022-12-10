console.log('hi')
fetch('http://localhost:443/getLink?state=1234')
    .then((res) =>
        res.json()
            .then(json => {
                window.location.href = json.url
            })) 