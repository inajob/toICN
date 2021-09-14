// ==UserScript==
// @name         toInstaChord ICN
// @namespace    https://github.com/inajob/toICN
// @version      0.1
// @homepage     https://github.com/inajob/toICN
// @match        https://ja.chordwiki.org/wiki/*
// @match        https://www.ufret.jp/song.php?data=*
// @match        https://gakufu.gakki.me/m/*
// @match        https://music.j-total.net/data/*
// @grant        none
// ==/UserScript==
exports = {};
//CSS関連
let style = document.createElement('style');
document.head.appendChild(style);
let webSiteName = "";
if(document.title.indexOf("U-フレット") != -1){webSiteName = "ufret"};
if(document.title.indexOf("ChordWiki") != -1){webSiteName = "chordwiki"};
if(document.title.indexOf("楽器.me") != -1){webSiteName = "gakki.me"};
if(document.title.indexOf("J-Total Music!") != -1){webSiteName = "j-total"};

let sheet = style.sheet;
sheet.insertRule('.word {color:#b22222}');
sheet.insertRule('.wordtop {color:#b22222}');
sheet.insertRule('.sharp {background-color:#dbdbdb}');
sheet.insertRule('.swap {background-color:#fab9bd}');
sheet.insertRule('.sharpswap {background-color:#d19fa0}');
sheet.insertRule('.notsharpswap {background-color:#ffffff}');
sheet.insertRule('.bluechord {color:#1a4a9c !important}');
sheet.insertRule('.notbluechord {color:#000000 !important}');

const scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const majorScale = ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
const minorScale = ["A","Bb","B","C","C#","D","D#","E","F","F#","G","G#"];

//フラットをシャープに置き換える関数
let sharpify = (s) => s.replace("＃","#").replace("♯","#").replace("♭","b").replace("Db","C#").replace("Eb","D#").replace("Fb", "E").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb", "B");

exports.Key = class{
  constructor(raw="",canDetectMajorOrMinor=false){ // keyがメジャーかマイナーか特定できる場合は canDetectMajorOrMinor=true
    let rawMatch = raw.match(/([A-G](#|b|＃|♯|♭){0,1})(.{0,1})/);
    let tmpKeyNo = rawMatch?scale.indexOf(sharpify(rawMatch[1])):-1;
    let tmpMinorSignature = rawMatch?rawMatch[3]:"";
    if(tmpMinorSignature == "m"){tmpKeyNo = (tmpKeyNo+3) % 12;}
    this.keyNo = tmpKeyNo;
    this.minorSignature = canDetectMajorOrMinor?tmpMinorSignature:"u";

    this.majorScaleName = this.keyNo==-1?"":majorScale[this.keyNo];
    this.minorScaleName = this.keyNo==-1?"":minorScale[this.keyNo] + "m";

    if (this.minorSignature == ""){this.key = this.majorScaleName;}
    else if (this.minorSignature == "m"){this.key = this.minorScaleName;}
    else{this.key = this.majorScaleName + "/" + this.minorScaleName;}
  }
};

exports.readKeyChords = function(webSiteName){
  let keyElm;
  let keyChordElms;
  if(webSiteName == "ufret"){keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("rt"))().map((e => e.firstChild));}
  if(webSiteName == "chordwiki"){
    keyChordElms = Array.prototype.slice.bind(document.querySelectorAll('.chord, .key'))().map((e => e.firstChild));
    keyElm = document.getElementsByClassName('key')[0];
  }
  if(webSiteName == "gakki.me"){
    let elms = Array.prototype.slice.bind(document.querySelectorAll(".cd_fontpos, .cd_font"))();
    keyChordElms = elms.map((e) => {
      if(e.firstChild.nodeType == Node.TEXT_NODE){
        return e.firstChild;
      }else if(e.firstChild.nextSibling && e.firstChild.nextSibling.nodeType == Node.TEXT_NODE){
        return e.firstChild.nextSibling;
      }
      return null;
    }).filter((e) => e != null);
    // for コード名表示
    keyChordElms = keyChordElms.concat(Array.prototype.slice.bind(document.getElementById("chord_area").getElementsByTagName("u"))().map((e => e.firstChild)));
  }
  if(webSiteName == "j-total"){
    keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("tt")[0].getElementsByTagName("a"))().map((e => e.firstChild));
    try{
    keyElm = document.getElementsByClassName("box2")[0].getElementsByTagName("h3")[0];
    }catch(e){}
  }
  let keyChords = keyChordElms?(keyChordElms.map((e) => {
    if(e){
      if(e.parentNode.classList.contains("key")){
        return {type: "key",v: e.nodeValue, elm: e};
      }
      return {type: "chord",v: e.nodeValue, elm: e}
    }else{
      return null;
    }
  }).filter((e) => e != null)):null;
  //書かれているキーを読み取り
  let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/(: |：)([A-G](#|b){0,1}m{0,1})$/):null;
 let detectedKey = new exports.Key(keyMatch?keyMatch[2]:"",true);
  return {keyChords: keyChords, key:detectedKey};
};

exports.autoDetectKey = function(keyChords){
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
  return detectedKey;
};

exports.toICN = function(raw,tmpKey){
  let ICNScale = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"];
  //chordを取り込む
  let m = raw.replace("on","/").match(/^([A-G](#|b|＃|♯|♭){0,1})([^/]*)(\/{0,1})(.*)/);
  let s = "";
  if(m){
    let base = sharpify(m[1]);
    let minorSignature = "";
    let q = m[3];
    let onChord = sharpify(m[5]);
    let swapped = false;
    let isQAvailable = false;
    let unSupported = false;
    let no = ICNScale[(scale.indexOf(base) + 12 - tmpKey.keyNo)% 12];
    let onChordNo = "";
    if(onChord!=""){
      onChordNo = ICNScale[(scale.indexOf(onChord) + 12 - tmpKey.keyNo)% 12];
    }
    // 9を7(9), maj7をM7等表記を置き換える
    q = q.replace(/^9$/,"7(9)").replace(/^add9$/,"9").replace(/^maj$/,"").replace(/^min$/,"m").replace(/^maj7$/,"M7").replace("7sus4","sus4").replace("dim7","dim").replace(/^m7b5|m7\(-5\)|m7\(b5\)$/,"m7-5");
    //マイナーのキーかどうかを判定
    if(q[0] == "m" && q.indexOf("m7-5") == -1){
      minorSignature = "m";
      q = q.replace("m","");
    }
    //スワップキーかどうかを判定
    if("1m,2,3,4m,5m,6,7,1#m,2#m,4#m,5#m,6#m".split(",").includes(no+minorSignature)){
      swapped = true;
    }
    if("7,M7,9,6".split(",").includes(q)){
      isQAvailable = true;
    }
    //sus4,aug,dim,m7-5の場合はスワップさせない
    if("sus4,aug,dim,m7-5".split(",").includes(q)){
      isQAvailable = true;
      swapped = false;
    }
    //サポートされていない記号である場合の処理
    else{
      if(q.length>0){
        unSupported = true;
      }
    }
    s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!!"+q+"!!]":""))+(onChordNo!=""?"/"+onChordNo:"");
  }
  return s;
};

exports.updateChords = function(keyChords, tmpKey, tmpIsAutoKeyDetection){
  let currentKey = tmpKey;
  let previousKey = new exports.Key(); 
  keyChords.forEach((e) => {
    if(e.type == "key"){
      // 転調の場合
      if(tmpIsAutoKeyDetection){
        let tmpKeyMatch = e.v.match(/(: |：)([A-G](#|b){0,1}m{0,1})$/);
        currentKey = new exports.Key(tmpKeyMatch?tmpKeyMatch[2]:"", true);
        if(previousKey.keyNo != -1){
          let keyModulationDegree = currentKey.keyNo - previousKey.keyNo;
          if(keyModulationDegree >= 7){keyModulationDegree -= 12;}
          else if(keyModulationDegree <= -6){keyModulationDegree += 12;}
          e.elm.nodeValue += (" ("+(keyModulationDegree>0?"+":"")+keyModulationDegree+")");
        }
        previousKey = currentKey;
      }
    }
    else{
      // コードの場合
      let icn = exports.toICN(e.v,currentKey);
      let isSharp = false;
      let isSwap = false;
      let isBlueChord = false;
      //シャープ、スワップ、特定のセブンスコード等の条件を満たすかどうかを調べる
      if(icn!=""){
        e.elm.nodeValue = icn;
        if(icn.match(/^([1-7])(#{0,1})(~{0,1})/)[2] == "#"){isSharp = true;}
        if(icn.match(/^([1-7])(#{0,1})(~{0,1})/)[3] == "~"){isSwap = true;}
        if("1[7],1#[7],4[7],4#[7],2[M7],2#[M7],3[M7],5[M7],5#[M7],6[M7],6#[M7],7[M7]".split(",").includes(icn) || /\[sus4\]|\[aug\]|\[dim\]|\[m7\-5\]$/.test(icn)){
          isBlueChord = true;
        }
      }
      //chordに色を付ける
      if(isSharp&&isSwap){e.elm.parentNode.classList.add("sharpswap");}
      else if(isSharp&&!isSwap){e.elm.parentNode.classList.add("sharp");}
      else if(!isSharp&&isSwap){e.elm.parentNode.classList.add("swap");}
      else{e.elm.parentNode.classList.add("notsharpswap");}
      if(isBlueChord){e.elm.parentNode.classList.add("bluechord");}
      else{e.elm.parentNode.classList.add("notbluechord");}
    }
  });
};
let isAutoKeyDetection = true;
let isKeyWritten = false;
let detectedKey;
let keyChords;
let isAutoDetected = false;

function main () {
  //ChordやKeyを読む
  let rawKeyChords = exports.readKeyChords(webSiteName);
  keyChords = rawKeyChords.keyChords;
  detectedKey = rawKeyChords.key;

  // キーが書かれていないときは、キーを自動判定する
  if(detectedKey.keyNo == -1){
    detectedKey = exports.autoDetectKey(keyChords);

    isAutoDetected = true;
  }

  // キーの手動設定
  var result = prompt("Key:" + detectedKey.key + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。\nキャンセルを押すと変換しません。");
  // キャンセルされると置き換えを実行しない
  if (result === null) return;
  let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
  let specifiedKey = new exports.Key(resultMatch?resultMatch[1]:"");
  if(specifiedKey.keyNo != -1){isAutoKeyDetection = false;}

  //表示書き換え関係
  exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
};

function waitElement(webSiteName, cb) {
  let selector;
  if (webSiteName === "ufret") {
    selector = 'ruby rt';
  }
  if (!selector) return cb();

  const timer = setInterval(function () {
    const resolve = function () {
      clearInterval(timer);
      cb();
    };
    if (!!document.querySelector(selector)) resolve();
  }, 300);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  waitElement(webSiteName, main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});
}