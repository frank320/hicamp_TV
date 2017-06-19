// JavaScript Document// JavaScript Document
function Voices(voiceleft, voicesLen, defaultVoice){	
	this.imgPosDis = -10; //音量图标与音量长度图的位置误差；	
	this.len = voicesLen; //音量总长度；
	this.voiceleft = voiceleft; //音量的初始位置；即为0的left位置；
	this.maxVoice = 31;	//音量100格为满格，每走一步+ 1 or - 1；
	this.stepLen = Math.round(voicesLen / this.maxVoice); //每走一步的长度	
	this.currentVoice = defaultVoice;	//当前音量, 最小为0,最大为this.maxVoice
	this.currentLen = this.setVoiceLen(defaultVoice); 	//音量的当前长度		
	this.parentObj = null;
	this.initShow = false; //whether show when init voice obj
	this.isNeedTimer = true; //whether need timer when voice control show. to hidden voice control
	this.voiceSeconds = 0;   // stat. voice timer seconds.
	this.voiceTimer = null;  //voice timer
	this.isExistVoiceTimer = false; // whether exist voice timer.
}
Voices.prototype.imgVoicePos = function(){ return document.getElementById("imgPosition"); } //音量位置对象	
Voices.prototype.imgVoiceLen = function(){ return document.getElementById("imgVoice");} //音量长度对象	
Voices.prototype.txtVoice = function(){	return document.getElementById("txtVoice");} //音量对象
Voices.prototype.init = function(parentObj){	
	var hl = "<p id=\"vo\"><img src=\"" + prefix + "images/vo.png\" width=\"800\" height=\"58\" /></p><p class=\"vo_g\" id=\"imgPosition\"><img src=\"" + prefix + "images/vo_g.png\" width=\"28\" height=\"18\" /></p><p class=\"vo_gre\"><img src=\"" + prefix + "images/vo_gre.png\" width=\"0\" height=\"6\" id=\"imgVoice\"/></p><p class=\"vo_vo\" id=\"txtVoice\"></p>";
	if (parentObj){
		parentObj.innerHTML = hl;
		this.parentObj = parentObj;
	}else{
		var pHTML = "<div id=\"dv_voice\" style=\"display:none;\">";
		if (this.initShow) pHTML = "<div id=\"dv_voice\">";			
		document.write(pHTML + hl + "</div>");	
		this.parentObj = document.getElementById("dv_voice");
	}	
	this.setImgVoicePos(0);
	this.setImgVoiceLen(0);
	this.setTxtVoice(this.currentVoice);
}
Voices.prototype.setVoiceLen = function(voice){	
	var currentLen = this.stepLen * voice; 
	if (currentLen > this.len) currentLen = this.len;
	return currentLen;
}
Voices.prototype.setImgVoicePos = function(pos){	
	var imgVoicePos = this.imgVoicePos();
	var cPos = this.currentLen + this.imgPosDis;
	cPos += pos;
	if(imgVoicePos)	imgVoicePos.style.left = (this.voiceleft + cPos) + "px";
}
Voices.prototype.setImgVoiceLen = function(pos){	
	var imgVoiceLen = this.imgVoiceLen();
	var cPos = this.currentLen + pos;	
	if(imgVoiceLen)	imgVoiceLen.width = cPos;
}
Voices.prototype.setTxtVoice = function(voice){	
	var txtVoice = this.txtVoice();
	if (voice > this.maxVoice) voice = this.maxVoice;
	if (voice < 0) voice = 0;
	if(txtVoice) txtVoice.innerHTML = voice;
}
Voices.prototype.clear = function(){ this.currentVoice = 0;	this.currentLen = 0;}
Voices.prototype.UpDown = function(type){	
	this.currentVoice += type;
	if (this.currentVoice < 0 && type < 0){ this.currentVoice = 0; return 1; }//起点,无法再往前.
	if (this.currentVoice > this.maxVoice && type > 0){ this.currentVoice = this.maxVoice; return 2;} //终点，无法再往后
	this.currentLen = this.setVoiceLen(this.currentVoice);
	this.setImgVoicePos(0);
	this.setImgVoiceLen(0);
	this.setTxtVoice(this.currentVoice);
	return 0;
}
Voices.prototype.voiceDisplay = function(isVoiceShow){
	if (this.parentObj == null) return;
	if (isVoiceShow){
		this.parentObj.style.display = "block";
		if (!this.isExistVoiceTimer && this.isNeedTimer){
			this.voiceTimer = setInterval("checkVoiceControl()",1000);
			this.isExistVoiceTimer = true;
		}
	}else{
		this.parentObj.style.display = "none";
		if(this.isExistVoiceTimer  && this.isNeedTimer){
			window.clearInterval(this.voiceTimer);
			this.isExistVoiceTimer = false;
		}
	}	
}
Voices.prototype.isVoiceDisplay = function(){
	if (this.parentObj == null) return false;
	return	(this.parentObj.style.display == "block");
}
