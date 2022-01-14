let video;
let poseNet;
let poses = [];

let eyeDistance = 500;
var myText;

let detector;
let detections;

let wHistory = [];
let hHistory = [];
let frameAverage = 3;


function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}
function windowResized() {
  centerCanvas();
}

var canvas;
function setup() {
  canvas = createCanvas(480, 360);
  centerCanvas();
  canvas.style('z-index','-1');
  canvas.hide();
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  let parentEl = document.getElementById('square');

  detector = ml5.objectDetector("cocossd", modelReady);
  
  video.hide();
  myText = document.getElementById("text");
}

function modelReady() {
  console.log("model loaded");
  detect();
}

function detect() {
  detector.detect(video, gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return;
  }
  detections = results;
  detect();
}

var personWidth = null;

function getWidth(label, detection) {
  if (label === detection.label) {
    return detection.width;
  }
  return null;
}

function getHeight(label, detection) {
  if (label === detection.label) {
    return detection.height;
  }
  return null;
}

const sumReducer = (previousValue, currentValue) => previousValue + currentValue;


function draw() { 
  translate(video.width,0);
  background(255)
  scale(-1,1);
  if (detections) {
    detections.forEach((detection) => {
      fill(0);
      textAlign(LEFT);

      //text(detection.label, detection.x + 4, detection.y + 10);

      personWidth = getWidth("person", detection) || personWidth;
      personHeight = getHeight("person", detection) || personWidth;
      
      wHistory.push(personWidth);
      hHistory.push(personHeight);
      
      if (wHistory.length > frameAverage) {
          wHistory.shift();
      }
      
      if (hHistory.length > frameAverage) {
        hHistory.shift();
      }
      
      let wAverage = wHistory.reduce(sumReducer) / wHistory.length;
      let hAverage = hHistory.reduce(sumReducer) / hHistory.length;
      
      //console.log(personWidth);

      noFill();
      strokeWeight(5);
      
       stroke(0,100,100,70);
      rect(detection.x, detection.y, wAverage, hAverage);
      
      if (personWidth) {
        
        var wghtValue = constrain(personWidth*4, 1, 1000);
        var wght = map(wAverage, 90, 480/2, 50, 150);
        var wdth = map(hAverage,280, 150, 50, 150);
        var settings = `font-variation-settings: "wght"${wght}, "wdth"${wdth}`;
  myText.setAttribute("style", settings);
         }
      
      
    });
  }
}

var headings = ['Total <br> Abdominal <br> Index <br> = <br> Index <br> of upper <br> abdominal','<span class="terzo">la femme presse</span>'];


var i = 0;
var intervalId = setInterval(function() {
  document.getElementById('text').innerHTML = headings[i];
  if (i == (headings.length - 1)) {
    i = 0;
    //you can even clear interval here to make heading stay as last one in array
    //cleanInterval(intervalId);

  } else {
    i++;
  }
}, 8000)
