const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        let {latitude , longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude})
    },(err)=>{
        throw Error(err)
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0      
    })
}

let map = L.map('map').setView([20.5937, 78.9629],18)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Garv Jindal",
}).addTo(map);

const markers = {}

socket.on("receive-location",(data)=>{
    let {id, latitude, longitude} = data;
    map.setView([latitude,longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id]= L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on('user-disconnected',(id)=>{
    map.removeLayer(markers[id])
    delete markers[id]
})