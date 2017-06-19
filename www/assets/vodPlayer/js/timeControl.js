function TimeControl(left, len) {
    this.imgPosDis = -40;
    this.len = len;
    this.left = left;
    this.allTimes = 0;
    this.beginTime = null;
    this.endTime = null;
    this.startTime = 0;
    this.stepLen = 0;
    this.currentLen = 0;
    this.showTime = "00:00:00";
    this.currentTimes = 0;
}
TimeControl.prototype.imgTCLen = function() {  return document.getElementById("imgTimeControl");}
TimeControl.prototype.imgTCPos = function() {  return document.getElementById("cicle");}
TimeControl.prototype.setTCLen = function(len) { 
    var imgTCLen = this.imgTCLen();
    var clen = this.currentLen + len;
    if (clen > this.len) clen = this.len;
    imgTCLen.width = clen;
    //imgTCLen.parentElement.style.left = this.left;
}
TimeControl.prototype.setTCPos = function(pos) {
    var imgTCPos = this.imgTCPos();
    var cPos = this.currentLen + this.imgPosDis;
    cPos += pos;
    imgTCPos.style.left = (this.left + cPos) + "px";
}
TimeControl.prototype.setLen = function(second) {
    var currentLen = this.stepLen * second;
    if (currentLen > this.len) currentLen = this.len;
    this.currentLen = currentLen;
}
TimeControl.prototype.setCurrentTime = function(second) {
    //if (second > this.allTimes) return;
    this.currentTimes = second;
    this.showTime = convertToShowTime(second);
}
TimeControl.prototype.init = function(parentObj, beginTime, endTime, startTime) {
    var hl = "<p id=\"g_c\"><img id=\"imgTimeControl\" src=\"" + prefix + "images/g_c.png\" width=\"0\" height=\"14\" /></p><p id=\"cicle\"><img src=\"" + prefix + "images/circle.png\" width=\"33\" height=\"35\" /></p>";
    if (parentObj) parentObj.innerHTML += hl;
    else document.write(hl);
    this.startTime = startTime;
    this.resetEndTime(beginTime, endTime);
    this.setCurrentTime(startTime);
    this.setLen(startTime);
    this.setTCPos(0);
    this.setTCLen(0);
}
TimeControl.prototype.resetEndTime = function(beginTime, endTime) {
    this.beginTime = beginTime;
    this.endTime = endTime;
    if (beginTime != null && endTime != null) {
        this.allTimes = endTime - beginTime - 5;
        if (this.allTimes < 0) {
            this.allTimes = 0;
            this.stepLen = 0;
        } else { this.stepLen = this.len / this.allTimes; }
    }
}
TimeControl.prototype.resetTC = function(playTime) {
    this.setLen(playTime);
    this.setCurrentTime(playTime);
    this.setTCPos(0);
    this.setTCLen(0);
}
TimeControl.prototype.clear = function() {
    this.currentLen = 0;
    this.startTime = 0;
    this.showTime = "00:00:00";
    this.currentTimes = 0;
    this.setTCPos(0);
    this.setTCLen(0);
}
TimeControl.prototype.UpDown = function(val) {
    var cTimes = this.currentTimes;
    var result = 0;
    cTimes += val;
    if (cTimes < 0 && val < 0) { cTimes = 0; result = 1; }
    if (cTimes > this.allTimes && val > 0) { cTimes = this.allTimes; result = 2; }
    this.setLen(cTimes);
    this.setCurrentTime(cTimes);
    this.setTCPos(0);
    this.setTCLen(0);
    return result; //is success.
}