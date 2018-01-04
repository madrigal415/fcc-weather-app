'use strict';

// getting that secret key
var mykey = config.MY_KEY;
var gKey = config.G_KEY;

// add year
var d = new Date();
var n = d.getFullYear();
document.getElementById('year').innerText = n;

function getWeather(crds){
    console.log(crds);
    return crds;
}

var tempUnit= "c";

function clearButtons(){
    document.getElementById('cels').classList.remove('btn-primary');
    document.getElementById('cels').classList.remove('btn-secondary');
    document.getElementById('faren').classList.remove('btn-primary');
    document.getElementById('faren').classList.remove('btn-secondary');
}

document.getElementById('cels').addEventListener('click',function(e){
    clearButtons();
    tempUnit='c';
    geoFindMe();
    document.getElementById('cels').classList.add('btn-primary');
    document.getElementById('faren').classList.add('btn-secondary');
});


document.getElementById('faren').addEventListener('click',function(e){
    clearButtons();
    tempUnit='f';
    geoFindMe();
    document.getElementById('faren').classList.add('btn-primary');
    document.getElementById('cels').classList.add('btn-secondary');
});

function geoFindMe() {
    // finding spot to put the new info 
    var output = document.getElementById("placeName");

    // testing to see of browser geolocation is working
    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }
        
    // if location works, grabbing the coordinates and creating a url 
    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=' + mykey;

        console.log('THE URL LADIES AND GENTS ' + weatherURL);
        
        getWeather(position);

        if (tempUnit=== 'c'){
            runAJAXC(weatherURL);
        } else if (tempUnit === 'f'){
            runAJAXF(weatherURL);
        } else {
            console.log('temp units not found');
        };
        
        // finding the city
        var geocoder = new google.maps.Geocoder();
                var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                console.log(position.coords.latitude + ', ' + position.coords.longitude);

            geocoder.geocode({'latLng': geolocate}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var result;
                    if (results.length > 1) {
                        result = results[1];
                    } else {
                        result = results[0];
                    }
                    //console.log(result);
                    
                    console.log(result.address_components[2].long_name + ', ' + result.address_components[3].long_name);
                    output.innerHTML = '<h3>' + result.address_components[2].long_name + '</h3>';
                }
            });
    }

    // if location getting doesn't work    
    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

// function switching kelvin to Celsius
function k_to_c(temp) {
    var tempC = Math.round(300-temp,2);
    return tempC;
};

// switching kelvin to farenheight 
function k_to_f(temp){
    var tempF = Math.round((temp -273.15) *9/5+32);
    return tempF;
};

// setting up the XHR, feeding in a url 
var httpRequestF = new XMLHttpRequest();
httpRequestF.onreadystatechange = function() {
    if(httpRequestF.readyState === 4){
        if(httpRequestF.status === 200){
            
            var data = httpRequestF.responseText;
            console.log('XXX');
            var obj = JSON.parse(data);
            console.log('temp: ' +obj.main.temp);
            console.log(obj["coord"]);
            document.getElementById('dummy').innerHTML = "<img src='https://openweathermap.org/img/w/" + obj.weather[0].icon + ".png' alt='Icon depicting current weather.'>";

            var innerF = "<p>" + k_to_f(obj.main.temp) + " &deg;F<p>" // kelvin to farenheit

            document.getElementById('temp_div').innerHTML =innerF;

        } else {
        console.log("There was a problem");
    } 
    }
    };

// setting up the XHR CELSIUS, feeding in a url 
var httpRequestC = new XMLHttpRequest();
httpRequestC.onreadystatechange = function() {
    if(httpRequestC.readyState === 4){
        if(httpRequestC.status === 200){
            
            var data = httpRequestC.responseText;
            console.log('XXX');
            var obj = JSON.parse(data);
            console.log('temp: ' +obj.main.temp);
            console.log(obj["coord"]);
            document.getElementById('dummy').innerHTML = "<img src='https://openweathermap.org/img/w/" + obj.weather[0].icon + ".png' alt='Icon depicting current weather.'>";

            var innerC = "<p>" + k_to_c(obj.main.temp) + " &deg;C<p>"; //kelvin to celsius 

            document.getElementById('temp_div').innerHTML =innerC;

        } else {
        console.log("There was a problem");
    } 
    }
    };



 // finding the city of the location
 
 
 // switching between 

// run the API open and send calls to Open Weather 
function runAJAXF(apiCustom) {
    httpRequestF.open("GET", apiCustom, true);
    httpRequestF.send();
};

function runAJAXC(apiCustom) {
    httpRequestC.open("GET", apiCustom, true);
    httpRequestC.send();
};

geoFindMe();