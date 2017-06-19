function countControl() {
    this.imgs = [];
    this.counter = 1;
    this.timmer;
    this.isCount = false;
    var imgWaitElement = "";
    var intervalTime = 1000;
    this.maxCount = 9;
    
    this.imgs = ["jdt.gif"];
    imgWaitElement = "<div id=\"imgProcess\" style='position:absolute;left:381px;top:280px;'><img id=\"countdown\" src=\"" + prefix + "images/jdt.gif\" align=\"middle\" width=\"518\" height=\"80\" /></div>";
   /* if (this.isCount) {
        this.imgs = ["pic_00.png","pic_1.png","pic_2.png","pic_3.png","pic_4.png","pic_5.png","pic_6.png","pic_7.png","pic_8.png"];
        imgWaitElement = "<div id=\"imgProcess\"><img id=\"countdown\" src=\"" + prefix + "images/pic_00.png\" align=\"middle\" width=\"81\" height=\"81\" /></div>";
    } else {
        this.imgs = ["0.png","1.png", "2.png","3.png","4.png","5.png","6.png","7.png","7.png"];
        imgWaitElement = "<div id=\"imgProcess\"><img id=\"countdown\" src=\"" + prefix + "images/0.png\" align=\"middle\" width=\"114\" height=\"102\" /></div>";
        intervalTime = 500;
        this.maxCount = 18;
    }*/
    var hl = "<div id=\"imgBj\" style=\"position:absolute;left:0px;top:0px;\"><img src=\"" + prefix + "images/wait.jpg\" width=\"1280\" height=\"720\" /></div>" + imgWaitElement;
    document.write(hl);
    this.timmer = setInterval("cControl.show()", 1000);
}
countControl.prototype.show = function() {
    //if (this.counter <= this.imgs.length) {
       // var cdimg = document.getElementById("countdown");
       // cdimg.src = prefix + "images/" + this.imgs[this.counter];
    //}
    if (this.counter >= this.maxCount) {
        this.stopTimer();
        location.href = prefix + "check_out.html?errorCode=100002";
    }
    this.counter++;
}
countControl.prototype.stopTimer = function() {
    clearInterval(this.timmer);
    this.imgDisplay(false);
}
countControl.prototype.imgDisplay = function(isShow) {
    var cDiv = document.getElementById("imgProcess");
    var bjDiv = document.getElementById("imgBj");
    if (isShow) {
        bjDiv.innerHTML = "<img src=\"" + prefix + "images/wait.jpg\" width=\"1280\" height=\"720\" />";
        cDiv.style.visibility = "visible";
    } else {
        bjDiv.innerHTML = "";
        setTimeout("cDiv.style.visibility = 'hidden';", 2000);
    }
}
var ipt = "-1";
function isCancelQuit() {
    ipt = getQueryStr("initPlayTime", LocString);
    if (ipt == "" || ipt == "-1") return false;
    return true;
}
var cControl = null;
if (!isCancelQuit()) cControl = new countControl();