let isAutoKeyDetection = true;
let isKeyWritten = false;
let detectedKey = new exports.Key();
let isAutoDetected = false;

//ChordやKeyを読む
let keyElm;
let keyChordElms;
if(document.title.indexOf("U-フレット") != -1){keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("rt"))();}
if(document.title.indexOf("ChordWiki") != -1){
  keyChordElms = Array.prototype.slice.bind(document.querySelectorAll('.chord, .key'))();
  keyElm = document.getElementsByClassName('key')[0];
}
if(document.title.indexOf("楽器.me") != -1){
  keyChordElms = Array.prototype.slice.bind(document.getElementsByClassName("cd_fontpos"))();
  // for コード名表示
  keyChordElms = keyChordElms.concat(Array.prototype.slice.bind(document.getElementById("chord_area").getElementsByTagName("u"))());
}
if(document.title.indexOf("J-Total Music!") != -1){
  keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("tt")[0].getElementsByTagName("a"))();
  keyElm = document.getElementsByClassName("box2")[0].getElementsByTagName("h3")[0];
}
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
detectedKey = new exports.Key(keyMatch?keyMatch[2]:"");
// キーが書かれていないときは、キーを自動判定する
if(detectedKey.keyNo == -1){
  let maxCount = 0;
  let chords = keyChords?(keyChords.map((e) => (e.type == "chord")?e:null)):null;
  scale.forEach((s) => {
    let tmpKey = new exports.Key(s);
    let notSwapCodesCount = chords.slice(0,30).map((s) => exports.toICN(s.v,tmpKey)).filter((s) => !(/dim|m7-5|aug/).test(s)).filter((s) => /^([123456][^#~]*$|3~[^#]*$)/.test(s)).length;
    if(notSwapCodesCount > maxCount){
      maxCount = notSwapCodesCount;
      detectedKey = tmpKey;
    }
  });
  isAutoDetected = true;
}

let displayedKey = isAutoDetected?(detectedKey.majorScaleName()+"/"+detectedKey.minorScaleName()):detectedKey.key();
// キーの手動設定
var result = prompt("Key:" + displayedKey + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。");
let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
let specifiedKey = new exports.Key(resultMatch?resultMatch[1]:"");
if(specifiedKey.keyNo != -1){isAutoKeyDetection = false;}

//表示書き換え関係
exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
