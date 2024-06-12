const char INDEX_HTML2[] PROGMEM = R"=====(
<!DOCTYPE html><html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Sensor graph</title>
<link rel="shortcut icon" href="/favicon.ico" />
</head>
<body>
<p>CO2濃度が1300以上もしくは、不快度指数が70以上だと危険な環境です。<p>
<div style="text-align:center;"><b>CO2濃度 (ppm)</b></div>
<div class="chart-container" position: relative; height:350px; width:100%">
  <canvas id="myChart1" width="600" height="400"></canvas>
</div>
<div style="text-align:center;"><b>不快度指数</b></div>
<div class="chart-container" position: relative; height:350px; width:100%">
  <canvas id="myChart2" width="600" height="400"></canvas>
</div>
<div style="text-align:center;"><b>温度 (℃)</b></div>
<div class="chart-container" position: relative; height:350px; width:100%">
  <canvas id="myChart3" width="600" height="400"></canvas>
</div>
</div>
<div style="text-align:center;"><b>湿度 (%)</b></div>
<div class="chart-container" position: relative; height:350px; width:100%">
  <canvas id="myChart4" width="600" height="400"></canvas>
</div>
<br><br>
<script src = "/Chart.min.js"></script>  
<script>
var graphData1 = {
  labels: [],  // X軸のデータ (時間)
  datasets: [{
                label: "CO2濃度",
                data: [], // Y co2ppm
                fill: false,
                borderColor: "rgba(255, 99, 132, 0.2)",
                backgroundColor: "rgba(254,97,132,0.5)",
            },
  ]
};

var graphData2 = {
  labels: [],  // X軸のデータ (時間)
  datasets: [
            {
                label: "不快度指数",
                data: [], // Y tempC
                fill: false,
                borderColor: "rgba(54, 162, 235, 0.2)",
                backgroundColor: "rgba(54, 162, 235, 1)",
            }
  ]
};

var graphData3 = {
  labels: [],  // X軸のデータ (時間)
  datasets: [
            {
                label: "温度",
                data: [], // Y humid
                fill: false,
                borderColor: "rgba(255, 206, 86, 0.2)",
                backgroundColor: "rgba(255, 206, 86, 1)",
            }
  ]
};

var graphData4 = {
  labels: [],  // X軸のデータ (時間)
  datasets: [
            {
                label: "湿度",
                data: [], // Y humid
                fill: false,
                borderColor: "rgba(0, 255, 41, 0.2)",
                backgroundColor: "rgba(0, 255, 841, 1)",
            }
  ]
};

var graphOptions = {
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      ticks: {beginAtZero:true}
    }]
  }
};  

var ctx1 = document.getElementById("myChart1").getContext('2d');
var chart1 = new Chart(ctx1, {
  type: 'line',
  data: graphData1,
  options: graphOptions
});
var ctx2 = document.getElementById("myChart2").getContext('2d');
var chart2 = new Chart(ctx2, {
  type: 'line',
  data: graphData2,
  options: graphOptions
});
var ctx3 = document.getElementById("myChart3").getContext('2d');
var chart3 = new Chart(ctx3, {
  type: 'line',
  data: graphData3,
  options: graphOptions
});
var ctx4 = document.getElementById("myChart4").getContext('2d');
var chart4 = new Chart(ctx4, {
  type: 'line',
  data: graphData4,
  options: graphOptions
});
var ws = new WebSocket('ws://' + window.location.hostname + ':81/');
ws.onmessage = function(evt) {
  var Time = new Date().toLocaleTimeString();
  var data_x1 = JSON.parse(evt.data)["co2ppm"];
  var data_x2 = JSON.parse(evt.data)["dis"];
  var data_x3 = JSON.parse(evt.data)["tempC"];
  var data_x4 = JSON.parse(evt.data)["humid"];
  console.log(Time);
  console.log(data_x1);
  console.log(data_x2);
  console.log(data_x3);
  console.log(data_x4);
  chart1.data.labels.push(Time);
  chart2.data.labels.push(Time);
  chart3.data.labels.push(Time);
  chart4.data.labels.push(Time);
  chart1.data.datasets[0].data.push(data_x1);
  chart2.data.datasets[0].data.push(data_x2);
  chart3.data.datasets[0].data.push(data_x3);
  chart4.data.datasets[0].data.push(data_x4);
  chart1.update();
  chart2.update();
  chart3.update();
  chart4.update();
};
ws.onclose = function(evt) {
  console.log("ws: onclose");
  ws.close();
}
ws.onerror = function(evt) {
  console.log(evt);
}
</script></body></html>
)=====";
