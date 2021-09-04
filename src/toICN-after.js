  let style = document.createElement('style');
  document.head.appendChild(style);
  let sheet = style.sheet;
  sheet.insertRule('.word {color:#b22222}');
  sheet.insertRule('.wordtop {color:#b22222}');
  sheet.insertRule('.sharp {background-color:#dbdbdb}');
  sheet.insertRule('.swap {background-color:#fab9bd}');
  sheet.insertRule('.sharpswap {background-color:#d19fa0}');
  sheet.insertRule('.bluechord {color:#1a4a9c !important}');
  sheet.insertRule('.notbluechord {color:#000000 !important}');

  let icn = module.exports(""+e.firstChild.nodeValue);
  let isSharp = false;
  let isSwap = false;
  let isBlueChord = false;
  if(icn!=""){
    e.firstChild.nodeValue = icn;
    if(icn.includes("#")){isSharp = true;}
    if(icn.includes("~")){isSwap = true;}
    if("1[7],1#[7],4[7],4#[7],2[M7],2#[M7],3[M7],5[M7],5#[M7],6[M7],6#[M7],7[M7]".split(",").includes(icn) || /\[sus4\]|\[aug\]|\[dim\]|\[m7\-5\]$/.test(icn)){
      isBlueChord = true;
    }
  }
  if(isSharp&&isSwap){e.classList.add("sharpswap");}
  else if(isSharp&&!isSwap){e.classList.add("sharp");}
  else if(!isSharp&&isSwap){e.classList.add("swap");}
  if(isBlueChord){e.classList.add("bluechord");}
  else{e.classList.add("notbluechord");}
})
