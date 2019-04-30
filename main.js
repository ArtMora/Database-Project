mdc.autoInit();

var drawer = new mdc.drawer.MDCDrawer(document.querySelector('.mdc-drawer'));
const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

$.get("http://35.226.19.21/api/marker", function (data) {
    var mymap = L.map("mapid").setView([39.82835, -98.5816684], 5);
    var latlngSet = new Set();

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1Ijoic3dvbGRlbWkiLCJhIjoiY2p2NDh0aTF5MHV0MjN5bDhnNDNndGtldiJ9.GquKMSt7Yj1vi25prmZUlA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'sk.eyJ1Ijoic3dvbGRlbWkiLCJhIjoiY2p2NDh0aTF5MHV0MjN5bDhnNDNndGtldiJ9.GquKMSt7Yj1vi25prmZUlA'
    }).addTo(mymap);

    data.forEach(function (item) {
        var currentLatLng = [item.latitude, item.longitude];
        if (latlngSet.has(currentLatLng)) {
            currentLatLng[0] += 20;
            currentLatLng[1] += 20;
        }
        else {
            latlngSet.add(currentLatLng);
        }
        
        var popupContent = `
        <b>NO2 AQI</b>: ${item.nO2AQI}<br/>
        <b>NO2 Max Hour</b>: ${item.nO2MaxHour}<br/>
        <b>NO2 Max Value</b>: ${item.nO2MaxValue}<br/>
        <b>NO2 Mean</b>: ${item.nO2Mean}<br/>
        
        <b>NO2 AQI</b>: ${item.o3AQI}<br/>
        <b>NO2 Max Hour</b>: ${item.o3MaxHour}<br/>
        <b>NO2 Max Value</b>: ${item.o3MaxValue}<br/>
        <b>NO2 Mean</b>: ${item.o3Mean}<br/>

        <b>SO2 AQI</b>: ${item.sO2AQI}<br/>
        <b>SO2 Max Hour</b>: ${item.sO2MaxHour}<br/>
        <b>SO2 Max Value</b>: ${item.sO2MaxValue}<br/>
        <b>SO2 Mean</b>: ${item.sO2Mean}<br/>
        `
        var marker = L.marker(currentLatLng).addTo(mymap);
        marker.bindPopup(popupContent);
    });

});