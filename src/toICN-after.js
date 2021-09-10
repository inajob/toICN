let isAutoKeyDetection = true;
let isKeyWritten = false;
let detectedKey = new exports.Key();
let isAutoDetected = false;

//ChordやKeyを読む
let keyElm;
let keyChordElms;
if(webSiteName == "ufret"){keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("rt"))();}
if(webSiteName == "chordwiki"){
  keyChordElms = Array.prototype.slice.bind(document.querySelectorAll('.chord, .key'))();
  keyElm = document.getElementsByClassName('key')[0];
}
if(webSiteName == "gakki.me"){
  keyChordElms = Array.prototype.slice.bind(document.getElementsByClassName("cd_fontpos"))();
  // for コード名表示
  keyChordElms = keyChordElms.concat(Array.prototype.slice.bind(document.getElementById("chord_area").getElementsByTagName("u"))());
}
if(webSiteName == "j-total"){
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
detectedKey = new exports.Key(keyMatch?keyMatch[2]:"",true);
// キーが書かれていないときは、キーを自動判定する
if(detectedKey.keyNo == -1){
  detectedKey = exports.autoDetectKey(keyChords);

  isAutoDetected = true;
}

// キーの手動設定
var result = prompt("Key:" + detectedKey.key + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。");
let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
let specifiedKey = new exports.Key(resultMatch?resultMatch[1]:"");
if(specifiedKey.keyNo != -1){isAutoKeyDetection = false;}

//表示書き換え関係
exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
