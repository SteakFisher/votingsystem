const houses = ['Jupiter', 'Saturn', 'Mars', 'Neptune']
const colors = {
    "Jupiter": "primary",
    "Saturn": "warning",
    "Mars": "danger",
    "Neptune": "success"
}
const codes = {
    200: 'alert-success',
    400: 'alert-danger',
    500: 'alert-warning'
}
const createGraph = (house, data) => {
    const options = {
        animationEnabled: true,

        data: [{
            type: "doughnut",
            innerRadius: "40%",
            legendText: "{label} cus",
            indexLabel: "{label}: #percent%",
            dataPoints: [
                { label: data['nameA'], y: data['countA'] },
                { label: data['nameB'], y: data['countB'] },
            ]
        }]
    };
    $(`#${house}_Chart`).CanvasJSChart(options);
}
window.onload = async () => {

    const res = await fetch('./getData')
    const data = await res.json()
    for (const house of houses) {
        createGraph(house, data[house])
    }


}
// {
//     Jupiter: { countA: 1, countB: 0, nameA: 'Joel', nameB: 'Sir' },
//     Mars: { countA: 0, countB: 0, nameA: 'Adith', nameB: 'they' },
//     Saturn: { countA: 0, countB: 0, nameA: 'Sunit', nameB: 'maam' },
//     Neptune: { countA: 0, countB: 0, nameA: 'Kaisd', nameB: 'Thes' }
//   }