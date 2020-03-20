Orchestrator = function () {
}

var csvContent = "";
var csvCountry = "";
var csvData = [];
var rowArray = ["id","date","time","latitude","longitude","depth","mag","magType","nst","gap","rms","place","type","status"];
let row = rowArray.join(",");
csvContent += row + "\n";
var index = 0;
var data = []
Orchestrator.prototype.loadData = function () {
    for (i = 0; i < 13; i++){
        d3.csv("./query (" + i + ").csv", function (loadedData) {
            for(j = 0; j < loadedData.length; j++){
                data.push(loadedData[j]);
            }
        });
    }

}


function createCSV(data){
    csvData = []
    row = []
    for (i = 0; i < data.length; i++) {
        var date = data[i].time.split("T")[0];
        var time = data[i].time.split("T")[1].split(".")[0];
        var lat = data[i].latitude;
        var long = data[i].longitude;
        var country = getCountry(data[i].place);
        if (country == "ambiguous") continue;
        row.push(index);
        row.push(date);
        row.push(time);
        row.push(lat);
        row.push(long);
        row.push(data[i].depth);
        row.push(data[i].mag);
        row.push(data[i].magType);
        row.push(data[i].nst);
        row.push(data[i].gap);
        row.push(data[i].rms);
        row.push(country);
        row.push(data[i].type);
        row.push(data[i].status);
        csvData.push(row);
        row = [];
        index += 1;
    }
    
    // Sort the array based on the earthquake frequency 
    csvData.sort(function(first, second) {
        return second[0] - first[0];
    });

    csvData.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\n";
    });

    
}


function createCountry(data){
    var countries = [];

    for(var i = 0; i < data.length; i++){
        var place = getCountry(data[i]["place"]);
        if (place != "ambiguous") countries.push(place);
        
    }

    var unique = function(origArr) {
        var newArr = [],
            origLen = origArr.length,
            found, x, y;
    
        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (origArr[x] === newArr[y]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newArr.push(origArr[x]);
            }
        }
        return newArr;
    }

    countries = unique(countries)
    

    countries.forEach(function(rowArray) {
        csvCountry += rowArray + "\n";
    });



    
}


function getCountry(place){
    if (place.split("-").length > 1 || place.includes("region") || place.includes("Islands") || place.includes("Alaska") || place.includes("Island")){
        return "ambiguous";
    }
    else if (place.includes("Svalbard and Jan Mayen")){
        place = "Norway"
    }
    else if (place.includes("Herzegovina")){
        place = "Bosnia and Herz."
    }
    else if (place.includes("Kashmir")){
        place = "India"
    }
    else if (place.includes("offshore")){
        place = place.split("offshore")[1];
    }
    else if (place.includes("Korea")){
        if (place.includes("North Korea")) return "Dem. Rep. Korea"
        else return "Korea"
    }
    else if (place.includes("Okhotsk")){
        return "Russia"
    }
    else if (place.includes("Chukotka")){
        return "Russia"
    }
    else if (place.includes("Ocean")){
        return place
    }
    else if (place.includes("Xizang")){
        return "China"
    }
    else if (place.includes("Pyrenees") || place.includes("Biscay")){
        return "Spain"
    }
    else if (place.includes("Sea")){
        return "ambiguous"
    }
    else if (place.includes("Czech Republic")){
        return "Czech Republic"
    }
    else if (place.split(",").length > 1){
        place = place.split(",")[1];
    }
    else if (place.includes("Sak'art'velo")){
        place = "Georgia";
    }
    else if (place.split(" ").length > 1){
        if (place.includes("region")) return place.trim();
        place = place.split(" ")[place.split(" ").length - 1];
    }
    place = place.trim();
    return place;
}

function download_country(){
    createCountry(data);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvCountry);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'country.csv';
    hiddenElement.click();
}


function download_csv(){
    createCSV(data);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'earthquake.csv';
    hiddenElement.click();
}


var orchestrator = new Orchestrator();
orchestrator.loadData();