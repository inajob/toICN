let scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
module.exports = function(raw){
  let ICNScale = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"];
  //chordを取り込む
  let m = raw.match(/^([A-G](#|b|♯|♭){0,1})([^/]*)/);
  let s = "";
  //フラットをシャープに置き換える関数
  let sharpify = (s) => s.replace("♯","#").replace("♭","b").replace("Db","C#").replace("Eb","D#").replace("Fb", "E").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb", "B");
  if(m){
    let base = sharpify(m[1]);
    let minorSignature = "";
    let q = m[3];
    let swapped = false;
    let isQAvailable = false;
    let unSupported = false;
    let keyNo = scale.indexOf(sharpify(key));
    //短調表記を長調表記に変える
    if(keyMinorSignature=="m"){keyNo += 3;}
    for(let i = 0; i < keyNo; i ++){
      scale.push(scale.shift());
    }
    let no = ICNScale[scale.indexOf(base)];
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
    s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!!"+q+"!!]":""));
  }
  return s;
};
