// Runs Notie alerts. Type of alert "success", "error", "warning"
function notify(type,msg){
    notie.alert({
        type: type, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
        text: msg,
        stay: false, // optional, default = false
        time: 1, // optional, default = 3, minimum = 1,
        position: "top" // optional, default = 'top', enum: ['top', 'bottom']
    })
}
