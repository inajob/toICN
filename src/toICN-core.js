const scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const majorScale = ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
const minorScale = ["A","Bb","B","C","C#","D","D#","E","F","F#","G","G#"];

//フラットをシャープに置き換える関数
let sharpify = (s) => s.replace("＃","#").replace("♯","#").replace("♭","b").replace("Db","C#").replace("Eb","D#").replace("Fb", "E").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb", "B");

exports.Key = class{
  constructor(raw=""){
    let rawMatch = raw.match(/([A-G](#|b|＃|♯|♭){0,1})(.{0,1})/);
    let tmpKeyNo = rawMatch?scale.indexOf(sharpify(rawMatch[1])):-1;
    let tmpMinorSignature = rawMatch?rawMatch[3]:"";
    if(tmpMinorSignature == "m"){tmpKeyNo = (tmpKeyNo+3) % 12;}
    this.keyNo = tmpKeyNo;
    this.minorSignature = tmpMinorSignature;
  }
  modulation(i){
    this.keyNo = (this.keyNo + 12 + i) % 12;
  }
  majorScaleName(){
    return this.keyNo==-1?"":majorScale[this.keyNo];
  }
  minorScaleName(){
    return this.keyNo==-1?"":minorScale[this.keyNo] + "m";
  }
};
/*
// "C" "Am" "C#m" などのキーネームをkeyNoに変換する関数、削除予定
exports.convertToKeyNo = function(raw="C", tmpMinorSignature=""){
  raw += tmpMinorSignature;
  let rawMatch = raw.match(/([A-G](#|b|＃|♯|♭){0,1})(.{0,1})/);
  let tmpKeyNo = scale.indexOf(sharpify(rawMatch[1]));
  tmpMinorSignature = rawMatch[3];
  if(tmpMinorSignature == "m"){tmpKeyNo = (tmpKeyNo+3) % 12;}
  return tmpKeyNo;
};

// 削除予定
exports.getDisplayedKey = function(key, minorSignature){
  let majorScale = ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
  let minorScale = ["C","C#","D","D#","E","F","F#","G","G#","A","Bb","B"];
  let displayedKey = "";
  if(minorSignature == ""){displayedKey = majorScale[scale.indexOf(key)];}
  else if(minorSignature == "m"){displayedKey = minorScale[scale.indexOf(key)] + "m";}
  else{displayedKey = majorScale[scale.indexOf(key)] + "/" + minorScale[(scale.indexOf(key)+9) % 12] + "m";}
  return displayedKey;
};
*/
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
        keyMatch = e.v.match(/(: |：)([A-G](#|b){0,1}m{0,1})$/);
        key = new exports.Key(keyMatch?keyMatch[2]:"");
        if(previousKey.keyNo != -1){
          let keyModulationDegree = key.keyNo - previousKey.keyNo;
          if(keyModulationDegree >= 7){keyModulationDegree -= 12;}
          else if(keyModulationDegree <= -6){keyModulationDegree += 12;}
          e.elm.firstChild.nodeValue += (" ("+(keyModulationDegree>0?"+":"")+keyModulationDegree+")");
        }
        previousKey = key;
      }
    }
    else{
      // コードの場合
      let icn = exports.toICN(e.v,key);
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
