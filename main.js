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
    const NO2Avgs = [22.52217, 24.5, 31.9917, 33.6066, 42.5909, 43.2000, 43.5333, 45.6635]
    const NO2Address = [
        "23, NM", "1028, AZ", "1011, AZ", "34, AK", "9997, AZ", "7, PA", "3003, AZ", "3002, AZ"
    ]

    var NO2data = NO2Avgs.map(function (e, i) {
        return { average: e, address: NO2Address[i] };
    });

    var NO2svg = d3.select("#NO2"),
        margin = 200,
        width = NO2svg.attr("width") - margin,
        height = NO2svg.attr("height") - margin
    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    NO2svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("NO2 Averages")

    var g = NO2svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    xScale.domain(NO2data.map(function (d) { return d.address; }));
    yScale.domain([0, d3.max(NO2data, function (d) { return d.average; })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Measurement Site, State");

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d + "ppm";
        })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("NO2 level (parts-per-million)")


    g.selectAll(".bar")
        .data(NO2data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.address); })
        .attr("y", function (d) { return yScale(d.average); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.average); });

    ////////////////////////////////


    const O3Avgs = [9.2, 9.2, 9.6, 9.8, 9.9, 10.02, 10.3, 10.43]
    const O3Address = [
        "1028, AZ", "23, NM", "3003, AZ", "7, PA", "34 AL", "1011, AZ", "3002, AZ", "9997, AZ"
    ]

    var O3data = O3Avgs.map(function (e, i) {
        return { average: e, address: O3Address[i] };
    });

    var O3svg = d3.select("#O3"),
        margin = 200,
        width = NO2svg.attr("width") - margin,
        height = NO2svg.attr("height") - margin
    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    O3svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("O3 Averages")

    var g = O3svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    xScale.domain(O3data.map(function (d) { return d.address; }));
    yScale.domain([0, d3.max(O3data, function (d) { return d.average; })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Measurement Site, State");

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d + "ppm";
        })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("O3 level (parts-per-million)")


    g.selectAll(".bar")
        .data(O3data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.address); })
        .attr("y", function (d) { return yScale(d.average); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.average); });

    ////////////////////////////////


    const SO2Avgs = [1.000, 2.68, 2.9, 2.9545, 3.9599, 4.226, 4.6, 16.8]
    const SO2Address = [
        "1028, AZ",
        "1011, AZ",
        "3003, AZ",
        "9997, AZ",
        "3002, AZ",
        "23, NM",
        "7, PA",
        "34, AL",
    ]

    var SO2data = SO2Avgs.map(function (e, i) {
        return { average: e, address: SO2Address[i] };
    });

    var SO2svg = d3.select("#SO2"),
        margin = 200,
        width = NO2svg.attr("width") - margin,
        height = NO2svg.attr("height") - margin
    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    SO2svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("SO2 Averages")

    var g = SO2svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    xScale.domain(SO2data.map(function (d) { return d.address; }));
    yScale.domain([0, d3.max(SO2data, function (d) { return d.average; })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Measurement Site, State");

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d + "ppm";
        })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("SO2 level (parts-per-million)")


    g.selectAll(".bar")
        .data(SO2data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.address); })
        .attr("y", function (d) { return yScale(d.average); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.average); });

    ////////////////////////////////


    const CO2Avgs = [0, 0, 0.04, 0.17, 0.63, 0.72, 0.944, 1.044]
    const CO2Address = [
        "1028, AZ",
        "7, PA",
        "23, NM",
        "1011, AZ",
        "9997, AZ",
        "34 AL",
        "3002, AZ",
        "3003, AZ"
    ]

    var CO2data = CO2Avgs.map(function (e, i) {
        return { average: e, address: CO2Address[i] };
    });

    var CO2svg = d3.select("#CO"),
        margin = 200,
        width = NO2svg.attr("width") - margin,
        height = NO2svg.attr("height") - margin
    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

        CO2svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("CO Averages")

    var g = CO2svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    xScale.domain(CO2data.map(function (d) { return d.address; }));
    yScale.domain([0, d3.max(CO2data, function (d) { return d.average; })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Measurement Site, State");

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d + "ppm";
        })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("CO level (parts-per-million)")


    g.selectAll(".bar")
        .data(CO2data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.address); })
        .attr("y", function (d) { return yScale(d.average); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.average); });
}