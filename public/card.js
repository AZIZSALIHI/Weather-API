const masterDiv = document.querySelector("#myData");
const loadingDiv = document.querySelector("#myLoader");

var input = document.getElementById("userInput");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("subButton").click();
    while (masterDiv.firstChild) {
      masterDiv.removeChild(masterDiv.firstChild);
    }
  }
});

function getInput() {
  this.userInput = document.getElementById("userInput").value;
  if (!isEmpty(this.userInput)) {
    while (masterDiv.firstChild) {
      masterDiv.removeChild(masterDiv.firstChild);
    }
    getWoeID(this.userInput);
  } else {
    while (masterDiv.firstChild) {
      masterDiv.removeChild(masterDiv.firstChild);
    }
  }
}

function loader(json) {
  if (isEmpty(json)) {
    while (loadingDiv.firstChild) {
      loadingDiv.removeChild(loadingDiv.firstChild);
    }
    const msg = `<div class="error"> Sorry, no results under that search query... </div>`;
    document.getElementById("myData").innerHTML =
      document.getElementById("myData").innerHTML + msg;
  } else {
    const msg = `<div class="error"> Loading results... </div>`;
    document.getElementById("myLoader").innerHTML =
      document.getElementById("myLoader").innerHTML + msg;
    getWeather(json[0].woeid);
  }
}

function isEmpty(str) {
  return !str || 0 === str.length;
}

function getWoeID(input) {
  let request = new XMLHttpRequest();
  request.open(
    "GET",
    `http://localhost:3000/search/${input}`
  );
  request.send();
  request.onload = () => {
    // console.log(request);
    if (request.status === 200) {
      const json = JSON.parse(request.response);
      // console.log(json);
      loader(json);
      // json.forEach((element) => getWeather(element.woeid));
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };
}

function getWeather(id) {
  let request = new XMLHttpRequest();
  request.open(
    "GET",
    `http://localhost:3000/${id}`
  );
  request.send();
  request.onload = () => {
    // console.log(request);
    if (request.status === 200) {
      const json = JSON.parse(request.response);
      // console.log(json);
      populateCards(json);
      sendDataLayer(json);
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };
}

function sendDataLayer(json) {
  var dataLayer = [];

  for (let item = 0; item < 4; item++) {
    const val = json.list[item];
    const x = `{"date": "${val.date}",
                            "condition": "${val.condition}",
                            "nowTemp": ${val.nowTemp},
                            "minTemp": ${val.minTemp},
                            "maxTemp": ${val.maxTemp},
                            "humidity": ${val.humidity},
                            "predictability": ${val.predictability}}`;
    dataLayer.push(x);
  }
  document.getElementById("DL").innerHTML =
    document.getElementById("DL").innerHTML +
    "dataLayer = [" +
    dataLayer +
    "];";
}

function populateCards(json) {
  for (let item = 0; item < 4; item++) {
    if (item === 0) {
      const val = json.list[item];
      const y = `<div class="card">
    <div class="left-panel panel">
      <div class="date">
        Today
      </div>
      <div class="location">
        ${json.city + ", " + json.country}
      </div>
      <hr>
      <div class="low">Low: ${val.minTemp}&deg;</div>
      <div class="high">High: ${val.maxTemp}&deg;</div>
      <div class="humidity">Humidity: ${val.humidity}&percnt;</div>
      <div class="probability">Predictability: ${
        val.predictability
      }&percnt;</div>
    </div>
    <div class="right-panel panel">
      <div class="temp">
        ${val.nowTemp}&deg;
      </div>
      <img src=https://www.metaweather.com/static/img/weather/png/64/${
        val.conditionAbbr
      }.png>
      <div class="condition">
        ${val.condition}
      </div>
    </div>
  </div>`;
      document.getElementById("myData").innerHTML =
        document.getElementById("myData").innerHTML + y;
    } else {
      const val = json.list[item];
      const y = `<div class="card">
    <div class="left-panel panel">
      <div class="date">
        ${val.date}
      </div>
      <div class="location">
        ${json.city + ", " + json.country}
      </div>
      <hr>
      <div class="low">Low: ${val.minTemp}&deg;</div>
      <div class="high">High: ${val.maxTemp}&deg;</div>
      <div class="humidity">Humidity: ${val.humidity}&percnt;</div>
      <div class="probability">Predictability: ${
        val.predictability
      }&percnt;</div>
    </div>
    <div class="right-panel panel">
      <div class="temp">
        ${val.nowTemp}&deg;
      </div>
      <img src=https://www.metaweather.com/static/img/weather/png/64/${
        val.conditionAbbr
      }.png>
      <div class="condition">
        ${val.condition}
      </div>
    </div>
  </div>`;
      document.getElementById("myData").innerHTML =
        document.getElementById("myData").innerHTML + y;
    }
  }
  while (loadingDiv.firstChild) {
    loadingDiv.removeChild(loadingDiv.firstChild);
  }
}

