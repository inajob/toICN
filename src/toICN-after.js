let isAutoKeyDetection = true;
let isKeyWritten = false;
let key = "";
let previousKeyNo = -1;
let keyMinorSignature = "";
let detectedKey = "";
let detectedKeyMinorSignature = "";
//ChordやKeyを読む
let chordElms;
let keyElm;
let keyChordElms;
if(document.title.indexOf("U-フレット") != -1){chordElms = Array.prototype.slice.bind(document.getElementsByTagName("rt"))();}
if(document.title.indexOf("ChordWiki") != -1){
  chordElms = Array.prototype.slice.bind(document.getElementsByClassName("chord"))();
  keyChordElms = Array.prototype.slice.bind(document.querySelectorAll('.chord, .key'))();
  keyElm = document.getElementsByClassName('key')[0];
}
if(document.title.indexOf("楽器.me") != -1){chordElms = Array.prototype.slice.bind(document.getElementsByClassName("cd_fontpos"))();}
if(document.title.indexOf("J-Total Music!") != -1){
  chordElms = Array.prototype.slice.bind(document.getElementsByTagName("tt")[0].getElementsByTagName("a"))();
  keyElm = document.getElementsByClassName("box2")[0].getElementsByTagName("h3")[0];
}
let chords = chordElms.map((e) => {return {type: "chord",v: e.firstChild.nodeValue, elm: e};});
let keyChords = keyChordElms?(keyChordElms.map((e) => {
  if(e){
    if(e.classList.contains("key")){
      return {type: "key",v: e.firstChild.nodeValue, elm: e};
    }
    return {type: "chord",v: e.firstChild.nodeValue, elm: e}
  }else{
    return null;
  }
}).filter((e) => e != null)):null;
//書かれているキーを読み取り
let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/(: |：)([A-G](#|b){0,1})(m{0,1})$/):null;
detectedKey = keyMatch?sharpify(keyMatch[2]):"";
detectedKeyMinorSignature = keyMatch?keyMatch[4]:"";
if(detectedKey == ""){
  // キーの自動判定
  let tmpDetectedKey = "";
  let maxCount = 0;
  scale.forEach((s) => {
    key = s;
    let notSwapCodesCount = chords.slice(0,30).map((s) => exports.toICN(s.v)).filter((s) => !(/dim|m7-5|aug/).test(s)).filter((s) => /^([123456][^#~]*$|3~[^#]*$)/.test(s)).length;
    if(notSwapCodesCount > maxCount){
      maxCount = notSwapCodesCount;
      detectedKey = key;
    }
  });
  key = "";
  detectedKeyMinorSignature = "u";
}
else{
  isKeyWritten = true;
}

let displayedKey = exports.getDisplayedKey(detectedKey, detectedKeyMinorSignature);
// キーの手動設定
var result = prompt("Key:" + displayedKey + (isKeyWritten?"(Webサイトが指定したキー)":"(コード譜を元に自動判定されたキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。");
let resultMatch = result.match(/([A-G](#|b){0,1})(m{0,1})$/);
let resultKey = (resultMatch?sharpify(resultMatch[1]):"");
let resultKeyMinorSignature = resultMatch?resultMatch[3]:"";
if(scale.includes(resultKey)){isAutoKeyDetection = false;}
if(isAutoKeyDetection){
  key = detectedKey;
  keyMinorSignature = detectedKeyMinorSignature=="u"?"":detectedKeyMinorSignature;
}
else{
  key = resultKey;
  keyMinorSignature = resultKeyMinorSignature;
}
//表示書き換え関係
exports.updateChords(keyChords?keyChords:chords);
