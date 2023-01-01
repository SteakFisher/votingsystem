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
                { label: "Contestant A", y: data['contestant A count'] },
                { label: "Contestant B", y: data['contestant B count'] },
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
//     Jupiter: {
//       'contestant B count': 0,
//       'contestant A count': 1
//     },
//     Mars: {
//       'contestant A count': 0,
//       'contestant B count': 0
//     },
//     Saturn: {
//       'contestant B count': 0,
//       'contestant A count': 0,
//
//     },
//     Neptune: {
//       'contestant A count': 0,
//       'contestant B count': 0
//     }
//   }