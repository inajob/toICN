  let style = document.createElement('style');
  document.head.appendChild(style);
  let sheet = style.sheet;
  sheet.insertRule('.sharp {background-color:#dbdbdb}');
  sheet.insertRule('.swap {background-color:#fab9bd}');
  sheet.insertRule('.sharpswap {background-color:#d19fa0}');

  let icn = module.exports(""+e.firstChild.nodeValue);
  let isSharp = false;
  let isSwap = false;
  if(icn!=""){
    e.firstChild.nodeValue = icn;
    if(icn.includes("#")){isSharp = true;}
    if(icn.includes("~")){isSwap = true;}
    if(isSharp&&isSwap){e.classList.add("sharpswap");}
    else if(isSharp&&!isSwap){e.classList.add("sharp");}
    else if(!isSharp&&isSwap){e.classList.add("swap");}
  }
})
