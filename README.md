# これは何？

[ChordWiki](https://ja.chordwiki.org/)と[U-FRET](https://www.ufret.jp/)のコード譜の表示をInstaChord（インスタコード）での演奏に適した表記法である[ICN](http://instachord.com/instruction/icn/) (InstaChord Number) に変換するブックマークレットです。

# 使い方

下記をブックマークとして登録してください。

```
javascript:(Array.prototype.slice.bind(document.getElementsByClassName("chord"))().concat(Array.prototype.slice.bind(document.getElementsByTagName("rt"))()).forEach((e) => {module = {exports:{}};module.exports = function(raw){let scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];let ICNScale = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"];let m = raw.match(/^([A-G](#|b){0,1})([^/]*)/);let s = "";if(m){let base = m[1].replace("Db","C#").replace("Eb","D#").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#");let minorSignature = "";let q = m[3];let swapped = false;let isQAvailable = false;let unSupported = false;let isSharp = false;let no = ICNScale[scale.indexOf(base)];isSharp = no.includes("#");q = q.replace(/^maj$/,"").replace(/^min$/,"m").replace(/^maj7$/,"M7").replace("7sus4","sus4").replace("dim7","dim").replace(/^m7b5|m7\(-5\)|m7\(b5\)$/,"m7-5");if("m,m7,mM7,m9,m6".split(",").includes(q)){minorSignature = "m";q = q.replace("m","");}if("1m,2,3,4m,5m,6,7,1#m,2#m,4#m,5#m,6#m".split(",").includes(no+minorSignature)){swapped = true;}if("7,M7,add9,6,sus4,aug,dim,m7-5".split(",").includes(q)){isQAvailable = true;}else{if(q.length>0){unSupported = true;}}s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!!"+q+"!!]":""));return s;}};let style = document.createElement('style');document.head.appendChild(style);let sheet = style.sheet;sheet.insertRule('.sharp {background-color:#dbdbdb}');sheet.insertRule('.swap {background-color:#fab9bd}');sheet.insertRule('.sharpswap {background-color:#d19fa0}');let icn = module.exports(""+e.firstChild.nodeValue);let isSharp = false;let isSwap = false;if(icn!=""){e.firstChild.nodeValue = icn;if(icn.includes("#")){isSharp = true;}if(icn.includes("~")){isSwap = true;}if(isSharp&&isSwap){e.classList.add("sharpswap");}else if(isSharp&&!isSwap){e.classList.add("sharp");}else if(!isSharp&&isSwap){e.classList.add("swap");}}}))
```

ChordWikiかU-FRETで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

# 既知のバグ

- KEY:C（ハ長調）のみに対応しているので、それ以外の曲はChordWikiやU-FRETの移調機能で移調したのちに、このツールを利用してください。
- https://github.com/inajob/toICN/issues に随時起票しています。（コメント、PR募集してます！）

# 開発方法

- toICN-before.js
- toICN-core.js
- toICN-after.js

を編集してください。

後工程で各行を連結するので行末にセミコロンを必ずつけてください。

`node test.js` でテストを実行できます。

編集が終わったら`gen.sh`を実行してください。下記ファイルが自動生成されます。

- toICN.js
- REAMDE.md

