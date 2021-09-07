exports = {};
//CSS関連
let style = document.createElement('style');
document.head.appendChild(style);
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
//フラットをシャープに置き換える関数
let sharpify = (s) => s.replace("＃","#").replace("♯","#").replace("♭","b").replace("Db","C#").replace("Eb","D#").replace("Fb", "E").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb", "B");
exports.getDisplayedKey = function(key, minorSignature){
  let majorScale = ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
  let minorScale = ["C","C#","D","D#","E","F","F#","G","G#","A","Bb","B"];
  let displayedKey = "";
  if(minorSignature == ""){displayedKey = majorScale[scale.indexOf(key)];}
  else if(minorSignature == "m"){displayedKey = minorScale[scale.indexOf(key)] + "m";}
  else{displayedKey = majorScale[scale.indexOf(key)] + "/" + minorScale[(scale.indexOf(key)+9) % 12] + "m";}
  return displayedKey;
};
exports.toICN = function(raw){
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
    let keyNo = scale.indexOf(sharpify(key));
    //短調表記を長調表記に変える
    if(keyMinorSignature=="m"){keyNo += 3;}
    let no = ICNScale[(scale.indexOf(base) + 12 - keyNo)% 12];
    let onChordNo = "";
    if(onChord!=""){
      onChordNo = ICNScale[(scale.indexOf(onChord) + 12 - keyNo)% 12];
    }
    // 9を7(9), maj7をM7等表記を置き換える
    q = q.replace(/^9$/,"7(9)").replace(/^add9$/,"9").replace(/^maj$/,"").replace(/^min$/,"m").replace(/^maj7$/,"M7").replace("7sus4","sus4").replace("dim7","dim").replace(/^m7b5|m7\(-5\)|m7\(b5\)$/,"m7-5");
    //マイナーのキーかどうかを判定
    if("m,m7,mM7,m9,m6".split(",").includes(q)){
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
exports.updateChords = function(keyChords){
  keyChords.forEach((e) => {
    if(e.type == "key"){
      // 転調の場合
      if(isAutoKeyDetection){
        keyMatch = e.v.match(/(: |：)([A-G](#|b){0,1})(m{0,1})$/);
        key = keyMatch?sharpify(keyMatch[2]):"";
        keyMinorSignature = keyMatch?keyMatch[4]:"";
        let keyNo = scale.indexOf(sharpify(key));
        if(keyMinorSignature=="m"){keyNo += 3;}
        if(previousKeyNo != -1){
          let keyModulationDegree = keyNo - previousKeyNo;
          if(keyModulationDegree >= 7){keyModulationDegree -= 12;}
          else if(keyModulationDegree <= -6){keyModulationDegree += 12;}
          e.elm.firstChild.nodeValue += (" ("+(keyModulationDegree>0?"+":"")+keyModulationDegree+")");
        }
        previousKeyNo = keyNo;
      }
    }
    else{
      // コードの場合
      let icn = exports.toICN(e.v);
      let isSharp = false;
      let isSwap = false;
      let isBlueChord = false;
      //シャープ、スワップ、特定のセブンスコード等の条件を満たすかどうかを調べる
      if(icn!=""){
        e.elm.firstChild.nodeValue = icn;
        if(icn.match(/^([1-7])(#{0,1})(~{0,1})/)[2] == "#"){isSharp = true;}
        if(icn.match(/^([1-7])(#{0,1})(~{0,1})/)[3] == "~"){isSwap = true;}
        if("1[7],1#[7],4[7],4#[7],2[M7],2#[M7],3[M7],5[M7],5#[M7],6[M7],6#[M7],7[M7]".split(",").includes(icn) || /\[sus4\]|\[aug\]|\[dim\]|\[m7\-5\]$/.test(icn)){
          isBlueChord = true;
        }
      }
      //chordに色を付ける
      if(isSharp&&isSwap){e.elm.classList.add("sharpswap");}
      else if(isSharp&&!isSwap){e.elm.classList.add("sharp");}
      else if(!isSharp&&isSwap){e.elm.classList.add("swap");}
      else{e.elm.classList.add("notsharpswap");}
      if(isBlueChord){e.elm.classList.add("bluechord");}
      else{e.elm.classList.add("notbluechord");}
    }
  });
};
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
if(document.title.indexOf("楽器.me") != -1){
  chordElms = Array.prototype.slice.bind(document.getElementsByClassName("cd_fontpos"))();
  // for コード名表示
  chordElms = chordElms.concat(Array.prototype.slice.bind(document.getElementById("chord_area").getElementsByTagName("u"))());
}
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
