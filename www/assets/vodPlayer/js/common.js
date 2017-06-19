String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/g, "");}
function jsonParse(text) {
	try {
		return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
				text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
			eval('(' + text + ')');
	} catch (e) { return false;}
}
/**************** Config start **************************/
var epgUrl = "http://172.31.178.2:8080/iPG/T-nsp/";
var maxSpeed = 16;
var defaultSpeed = 16;
var isTopWay = true;
var prefix = ""; //"vodctrl/";
var FORWARD_KEY = 39; 
var REWIND_KEY = 37;
var FAST_FORWARD_KEY = 120;
var FAST_REWIND_KEY = 121; 
var PAUSE_KEY = 3864;
var ENTER_KEY = 13;
var RETURN_KEY = 640;//);8;//
var PLAY_KEY = 3862;
var QUIT_KEY = 114;
var KEY_PAGEUP = 49;
var KEY_PAGEDOWN = 50; 
var YELLOW_KEY = 97;//113;
var GREEN_KEY = 99;//114;
var BLUE_KEY=98 
var KEY_LX=642;
var STOP_KEY = 3863;
var KEY_VOICEUP = 448; 
var KEY_VOICEDOWN = 447; 
var KEY_POSITION = 3880;
var KEY_TRACK = 407;
var KEY_STATIC = 449;
var KEY_HOMEPAGE =  113;//( ||)3856;//
var KEY_INFORMATION =  457;
var KEY_LANGUAGE =  35;
var KEY_SCREENDISPLAY = 42;
var KEY_UP=38;
var KEY_DOWN=40;
/**************** Config end **************************/
var LocString = String(window.document.location.href);
function getUserId() { try { var userId = Utility.getSystemInfo("UID"); if (userId == "") return 0; return userId; } catch (e) { return 0; } }
function getSmartCardId() { try { return Utility.getSystemInfo("SID");  } catch (e) { return 0; } }
function setSmartCardId(){ try { setGlobalVar("currentSmartCardId", getSmartCardId()); } catch (e) {} }
function $(id){	return document.getElementById(id);}
function getQueryStr(qs, allStr){
	var rs = new RegExp("(^|)"+qs+"=([^\&]*)(\&|$)","gi").exec(allStr), tmp;
	if(tmp = rs) return tmp[2];
	return "";
}
function getMaxPauseTime() {
    var time = Utility.getSystemInfo("SaServiceInfo.VOD_MAX_PAUSE_TIME");
    if (time != "") return parseInt(time, 10);
    return 300; 
}
String.prototype.replaceQueryStr = function(replaceVal, searchStr) {
    var restr = searchStr + "=" + replaceVal;
    var rs = new RegExp("(^|)" + searchStr + "=([^\&]*)(\&|$)", "gi").exec(this), tmp;
    var val = null;
    if (tmp = rs) val = tmp[2];
    if (val == null) {
        if (this.lastIndexOf("&") == this.length - 1) return this + restr;
        else if (this.lastIndexOf("?") >= 0) return this + "&" + restr;
        return this + "?" + restr;
    }
    var shs = searchStr + "=" + val;
    if (this.lastIndexOf("?" + shs) >= 0) return this.replace("?" + shs, "?" + restr);
    return this.replace("&" + shs, "&" + restr);
}
function setGlobalVar(sName, sValue) {
	try{ Utility.setEnv(sName, sValue);}catch(e){ document.cookie = escape(sName) + "=" + escape(sValue);}
}
function getGlobalVar(sName){
	var result = null;
	try{ result = Utility.getEnv(sName);
	}catch(e){
		var aCookie = document.cookie.split("; ");
		for (var i = 0; i < aCookie.length; i++){
			var aCrumb = aCookie[i].split("=");
			if (escape(sName) == aCrumb[0]){
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}
function addZero(val){	
	if (val < 10) return "0" + val;
	return val;
}
function removeZero(val){	
	if (val.length > 1 && val.indexOf("0") == 0) return parseInt(val.substr(1), 10);
	return parseInt(val, 10);
}
function getDateStr(seconds){	
	if (isNaN(seconds)) seconds= 0;
	var time = new Date(seconds * 1000);
	return (time.getYear() + getExactYearDis()) + addZero((time.getMonth() + 1)) + addZero(time.getDate()) + addZero(time.getHours()) + addZero(time.getMinutes()) + addZero(time.getSeconds());
}
function convertToDate(val){//val: yymmddhhmmss
	var darr = new Array(6);	
	var index = 4;
	for(var i = 0; i < 6; i ++){
		darr[i] = parseInt(removeZero(val.substr(0,index)), 10);
		val = val.substr(index);
		index = 2;
	}
	return darr;
}
function convertToShowTime(second){
	if (isNaN(second) || second < 0) second = 0;	 
	var hh = parseInt(second / 3600);
	var mm = parseInt((second % 3600) / 60); //must be round
	var ss = (second % 3600) % 60;
	return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}
function getIntValue(val){
	if (val != null && val != "" && !isNaN(val)) return parseInt(val, 10);
	return 0;
}
function getStatusImgSrc(status){
	var src = "";
	switch(status){
		case 0: //play
			src = prefix + "images/button_q.png";
			break;
		case 1: //pause
			src = prefix + "images/button_s.png"; 
			break;
		case 3: //fast forward
			src = prefix + "images/button_g.png";//button_qb.png";
			break;
		case 4: //fast rewind
			src = prefix + "images/button_b.png";//button_go.png";
			break;
		case 5: //forward
			//src = prefix + "images/button_q.png";//button_g.png";
			break;
		case 6: //rewind
			//src = prefix + "images/button_q.png";//button_b.png";
			break;	
	}
	return src;
}
function getTrackStr(val){
	var str = "";
	switch(val.toUpperCase()){
		case "LEFT": 
			str = "%E5%B7%A6%E5%A3%B0%E9%81%93";
			break;
		case "RIGHT": 
			str = "%E5%8F%B3%E5%A3%B0%E9%81%93";
			break;
		case "STEREO": 
			str = "%E7%AB%8B%E4%BD%93%E5%A3%B0";//"%E5%85%A8%E5%A3%B0%E9%81%93";
			break;
	}
	return decodeURIComponent(str);
}
function getMatchModeStr(val) {
    var str = "";
    switch (val){
        case 0: //PanScan
            str = "%E8%87%AA%E9%80%82%E5%BA%94";
            break;
        case 1: //LetterBox
            str = "%E5%8F%98%E7%84%A6";
            break;
        //case 2: //ComBined
           // str = "ComBined";
            //break;
        case 2: //Ignore
            str = "%E5%85%A8%E5%B1%8F";
            break;   
    }
    return decodeURIComponent(str);
}
function getPostionStr(val) {
    var str = "";
    switch (val) {
        case 0:
            str = "%E8%BE%93%E5%85%A5%E6%97%B6%E9%97%B4%E6%AF%94%E6%80%BB%E6%97%B6%E9%97%B4%E9%95%BF"; //the input time is longer than all time
            break;
        case 1:
            str = "%E8%BE%93%E5%85%A5%E6%97%B6%E9%97%B4%E6%97%A0%E6%95%88"; // the input time is invalidate
            break;
        case 2:
            str = "%E8%B6%85%E5%87%BA%E5%AE%9A%E4%BD%8D%E6%97%B6%E9%97%B4%E6%AE%B5"; // the input time is bigger than the limit time
            break;
    }
    return decodeURIComponent(str);
}
function getExactYearDis(){	return 1900;}
function getDateObj(){	return new Date();}