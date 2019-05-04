mdc.autoInit();
var drawer = new mdc.drawer.MDCDrawer(document.querySelector('.mdc-drawer'));
var slider = new mdc.slider.MDCSlider(document.querySelector('.mdc-slider'));
var menu = new mdc.menu.MDCMenu(document.querySelector('.mdc-menu'));

const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});
menu.hoistMenuToBody();
document.getElementById("closer").addEventListener("click", function () {
    drawer.open = false;
});
document.getElementById("code-repos").addEventListener("click", function () {
    menu.open = !menu.open;

});

if (window.location.pathname !== "/comparisons.html") {
    var mymap = L.map("mapid").setView([39.82835, -98.5816684], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1Ijoic3dvbGRlbWkiLCJhIjoiY2p2NDh0aTF5MHV0MjN5bDhnNDNndGtldiJ9.GquKMSt7Yj1vi25prmZUlA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'sk.eyJ1Ijoic3dvbGRlbWkiLCJhIjoiY2p2NDh0aTF5MHV0MjN5bDhnNDNndGtldiJ9.GquKMSt7Yj1vi25prmZUlA'
    }).addTo(mymap);

    function updateMap(year) {
        $.get(`https://machserve.io/api/marker/${year}`, function (data) {
            data.forEach(function (item) {
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
        <b>SO2 Mean</b>: ${item.sO2Mean}<br/>`
                var marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
                marker.bindPopup(popupContent);
            });
        });
    }

    slider.listen('MDCSlider:change', function () {
        // When the value of the slider changes, redraw the map
        updateMap(slider.value);
    });

    function initMap() {
        $.get("https://machserve.io/api/marker/2000", function (data) {
            data.forEach(function (item) {
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
                var marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
                marker.bindPopup(popupContent);
            });
        });
    }

    initMap();
}
else {
    console.log("on /comparisons.html")
}