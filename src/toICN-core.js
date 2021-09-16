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
    if(!keyElm){ // 古いスタイルのHTMLに対応するため
      keyElm = document.querySelectorAll("tr td font")[5];
    }
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

exports.toICN = function(raw,tmpKey,level=2){
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
    // レベルを問わず、9を7(9), maj7をM7等表記を置き換える
    q = q.replace(/^maj$/,"").replace(/^min$/,"m").replace(/^maj7$/,"M7").replace(/^m7b5|m7\(-5\)|m7\(b5\)$/,"m7-5");
    //マイナーのキーかどうかを判定
    if(q[0] == "m" && q.indexOf("m7-5") == -1){
      minorSignature = "m";
      q = q.replace("m","");
    }
    q = q.replace(/^9$/,"7(9)");
    // level 3以下のときは、インスタコードで弾けるキーに置き換える
    if(level <= 3){q = q.replace(/^add9$/,"9").replace(/^7sus4$/,"sus4").replace(/^dim7$/,"dim").replace(/^7\(9\)$/,"7");}
    //スワップキーかどうかを判定
    if("1m,2,3,4m,5m,6,7,1#m,2#m,4#m,5#m,6#m".split(",").includes(no+minorSignature)){
      swapped = true;
    }
    // Level 1のときは、7・M7・9・6を表示しない
    if("7,M7,9,add9,6".split(",").includes(q) && level >= 2){
      isQAvailable = true;
    }
    //sus4,aug,dim,m7-5の場合はスワップさせない、レベル3以下用
    if("sus4,7sus4,aug,dim,dim7,m7-5".split(",").includes(q)){
      isQAvailable = true;
      swapped = false;
    }
    //サポートされていない記号である場合の処理（レベル4のときのみ表示）
    else{
      if(q.length>0 && level >= 4){
        unSupported = true;
      }
    }
    s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!"+q+"!]":""))+((onChordNo!=""&&level>=3)?"/"+onChordNo:"");  }
  return s;
};

exports.updateChords = function(keyChords, tmpKey, tmpIsAutoKeyDetection, level=2){
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
          e.elm.nodeValue = "Key: " + currentKey.key +" ("+(keyModulationDegree>0?"+":"")+keyModulationDegree+")";
        }
        previousKey = currentKey;
      }
    }
    else{
      // コードの場合
      let icn = exports.toICN(e.v,currentKey,level);
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
      //chordの色を解除する。test.js対策のためtry-catch
      try{e.elm.parentNode.classList.remove("sharpswap", "sharp", "swap", "notsharpswap", "bluechord", "notbluechord");} catch(error){}
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
