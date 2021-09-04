let key = "";
let keyMinorSignature = "";
//コード譜に書かれてあるキー（調）を取り込む。最初のものを利用
let keyElm = document.getElementsByClassName('key')[0];
let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/: ([A-G](#|b){0,1})(m{0,1})$/):null;
let key = keyMatch?keyMatch[1]:"";
let keyMinorSignature = keyMatch?keyMatch[3]:"";
let module = {exports:{}};
//CSS関連
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

