const URL = "https://teachablemachine.withgoogle.com/models/N7kh-fIE2/";
let model, webcam, maxPredictions, probab;
var compx = 30;
var compy = 30;
var r,u;
var canvaswidth = document.documentElement.clientWidth;
var canvasheight = document.documentElement.scrollHeight;
div1 = document.getElementById("div1");
if (annyang) {
    var commands = {
      'click': function(){
        document.elementFromPoint(compx-document.documentElement.scrollLeft,compy-document.documentElement.scrollTop ).click();
        console.log("clock");
      }
    }
};

annyang.addCommands(commands);
annyang.start();

async function init(){
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 200;
    const flip = true;
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);
}

async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);
    r= (-Math.round(prediction[0].probability.toFixed(2)))||(Math.round(prediction[1].probability.toFixed(2)))
    u= (-Math.round(prediction[3].probability.toFixed(2)))||(Math.round(prediction[2].probability.toFixed(2)))
    console.log(r,u);
    component.speedx = 10*r;
    component.speedy = -10*u;

    compx = component.x;
    compy = component.y;
    //console.log(compx,compy);
}


function Cursor(x,y,source){
  this.x = x;
  this.y = y;
  this.speedx = 0;
  this.speedy = 0;
  this.width = 30;
  this.height = 30;
  this.image = new Image();
  this.image.src = source;
  this.update = function () {
      ctx= CanvasBoard.context;
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  this.move = function () {
      if(this.x>0 && this.x < (canvaswidth - this.width)){
        this.x+=this.speedx;
      }else if(this.x <= 0){
        this.x = 5;
      }
      else {
        this.x = canvaswidth - this.width - 5;
      }
      if(this.y>0 && this.y < (canvasheight - this.height)){
        this.y+=this.speedy;
      }else if(this.y<= 0){
        this.y = 5;
      }else{
        this.y = canvasheight - this.height - 5;
      }
  }
}
var CanvasBoard= {
  canvas : document.getElementById("canvas"),
  start : function(){
      this.canvas.width = canvaswidth;
      this.canvas.height = canvasheight;
      this.context = this.canvas.getContext("2d");
      //this.canvas.style.border = "5px solid #d3d3d3";
      //this.canvas.style.zIndex = "1";
      this.interval = setInterval(updateCanvas, 20);
      //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  // stop: function () {
  //     clearInterval(this.interval);
  // }
}
function updateCanvas(){
  CanvasBoard.clear();
  component.move();
  component.update();
}

//lruds

component = new Cursor(compx,compy, "cursor.png");
CanvasBoard.start();
//document.getElementById("div").style.zIndex = "0";
init()
