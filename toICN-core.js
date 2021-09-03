module.exports = function(raw){
  let scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  let ICNScale = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"];
  let raw = ""+ e.firstChild.nodeValue;
  let m = raw.match(/^([A-G](#|b){0,1})(m{0,1})([^/]*)/);
  let s = "";
  if(m){
    let base = m[1].replace("Db","C#").replace("Eb","D#").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#");
    let minorSignature = m[3];
    let q = m[4];
    let swapped = false;
    let isQAvailable = false;
    let unSupported = false;
    let isSharp = false;
    let no = ICNScale[scale.indexOf(base)];
    isSharp = no.includes("#");
    if("1m,2,3,4m,5m,6,7".split(",").includes(no[0]+minorSignature)){
      swapped = true;
    }
    q = q.replace("7sus4","sus4").replace("dim7","dim").replace("7-5","m7-5");
    if("7,M7,9,6".split(",").includes(q)){
      isQAvailable = true;
    }
    else if("sus4,aug,dim,m7-5".split(",").includes(q)){
      isQAvailable = true;
      swapped = false;
    } 
    else{
      if(q.length>0){
        unSupported = true;
      }
    }
    s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!!"+q+"!!]":""));
    return s;
  }
};
