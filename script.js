let video;
let poseNet;
let poses = [];
let skeletons = [];

let leftEars = [];
let rightEars = [];
let leftShoulder = [];
let rightShoulder = [];

let crown = null;
let toga = null;

function preload(){
  crown = loadImage("https://cdn.glitch.com/a7b44f94-178f-4f2f-bdd9-0f623a6d7456%2Fdownload.png?v=1561772037564")
  toga = loadImage("https://cdn.glitch.com/a7b44f94-178f-4f2f-bdd9-0f623a6d7456%2Ftoga.png?v=1561772597840")
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  drawKeypoints();
  drawCrown();
  drawToga();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        if(keypoint.part == "leftEar"){
          leftEars = [keypoint.position.x, keypoint.position.y]
          // console.log(leftEyes);
        }
        if(keypoint.part == "rightEar"){
          rightEars = [keypoint.position.x, keypoint.position.y]
        }
        if(keypoint.part == "leftShoulder"){
          leftShoulder = [keypoint.position.x, keypoint.position.y]
        }
        if(keypoint.part == "rightShoulder"){
          rightShoulder = [keypoint.position.x, keypoint.position.y]
        }
        // Debugging - see keypoints
        // fill(255, 0, 0);
        // noStroke();
        // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

function drawCrown(){
  if(leftEars != null && rightEars != null) {
    let crownWidth = (leftEars[0] - rightEars[0]) * 1.3
    let crownHeight = crownWidth/4
    let offset = crownHeight * 2.3
    let img = image(crown, rightEars[0], leftEars[1] - offset, crownWidth, crownHeight);
    leftEars = null;
    rightEars = null;   
 }
}

function drawToga(){
  if(leftShoulder != null && rightShoulder != null) {
    let togaWidth = (leftShoulder[0] - rightShoulder[0]) * 1.5
    let togaHeight = togaWidth
    let offsetY = togaHeight/4
    let offsetX = togaWidth/10
    let img = image(toga, rightShoulder[0] - offsetX, leftShoulder[1] - offsetY, togaWidth, togaHeight);
    leftShoulder = null;
    rightShoulder = null;   
 }
}




