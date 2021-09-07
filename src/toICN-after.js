let isAutoKeyDetection = true;
let isKeyWritten = false;
let key = new exports.Key(); //key
let previousKey = new exports.Key(); //previousKeyNo
//let keyMinorSignature = "";
let detectedKey = new exports.Key();
let isAutoDetected = false;
//let detectedKeyMinorSignature = "";
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
if(document.title.indexOf("楽器.me") != -1){
  chordElms = Array.prototype.slice.bind(document.getElementsByClassName("cd_fontpos"))();
  // for コード名表示
  chordElms = chordElms.concat(Array.prototype.slice.bind(document.getElementById("chord_area").getElementsByTagName("u"))());
}
if(document.title.indexOf("J-Total Music!") != -1){
  chordElms = Array.prototype.slice.bind(document.getElementsByTagName("ttKey")[0].getElementsByTagName("a"))();
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
let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/(: |：)([A-G](#|b){0,1}m{0,1})$/):null;
detectedKey = new exports.Key(keyMatch?keyMatch[2]:"");//keyMatch?sharpify(keyMatch[2]):"";
if(detectedKey.keyNo == -1){
  // キーの自動判定
  let maxCount = 0;
  scale.forEach((s) => {
    key = new exports.Key(s);
    let notSwapCodesCount = chords.slice(0,30).map((s) => exports.toICN(s.v,key)).filter((s) => !(/dim|m7-5|aug/).test(s)).filter((s) => /^([123456][^#~]*$|3~[^#]*$)/.test(s)).length;
    if(notSwapCodesCount > maxCount){
      maxCount = notSwapCodesCount;
      detectedKey = key;
    }
  });
  key = new exports.Key();
  isAutoDetected = true;
}

let displayedKey = detectedKey.majorScaleName() + "/" + detectedKey.minorScaleName();
// キーの手動設定
var result = prompt("Key:" + displayedKey + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。");
let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
let resultKey = new exports.Key(resultMatch?resultMatch[1]:"");
if(resultKey.keyNo != -1){isAutoKeyDetection = false;}
if(isAutoKeyDetection){key = detectedKey;}
else{key = resultKey;}

//表示書き換え関係
exports.updateChords(keyChords?keyChords:chords);
