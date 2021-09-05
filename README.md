# これは何？

[ChordWiki](https://ja.chordwiki.org/)と[U-FRET](https://www.ufret.jp/)のコード譜の表示をInstaChord（インスタコード）での演奏に適した表記法である[ICN](http://instachord.com/instruction/icn/) (InstaChord Number) に変換するブックマークレットです。

- [InstaChord(インスタコード)の購入はこちら](https://c.affitch.com?ref=QEP6CNKKRACV)
  - アフィリエイトコードが入っています。そういうのが嫌な方は直接検索してください。
  - インスタコードは代理店を持たず[「紹介パートナー制度」](https://instachord.com/overview/d2c/)を採用しています。

# 使い方

下記をブックマークとして登録してください。

```
javascript:(function(){let module = {exports:{}};let style = document.createElement('style');document.head.appendChild(style);let sheet = style.sheet;sheet.insertRule('.word {color:#b22222}');sheet.insertRule('.wordtop {color:#b22222}');sheet.insertRule('.sharp {background-color:#dbdbdb}');sheet.insertRule('.swap {background-color:#fab9bd}');sheet.insertRule('.sharpswap {background-color:#d19fa0}');sheet.insertRule('.bluechord {color:#1a4a9c !important}');sheet.insertRule('.notbluechord {color:#000000 !important}');let scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];module.exports = function(raw){let ICNScale = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"];let m = raw.match(/^([A-G](#|b|♯|♭){0,1})([^/]*)/);let s = "";let sharpify = (s) => s.replace("♯","#").replace("♭","b").replace("Db","C#").replace("Eb","D#").replace("Fb", "E").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb", "B");if(m){let base = sharpify(m[1]);let minorSignature = "";let q = m[3];let swapped = false;let isQAvailable = false;let unSupported = false;let keyNo = scale.indexOf(sharpify(key));if(keyMinorSignature=="m"){keyNo += 3;}for(let i = 0; i < keyNo; i ++){scale.push(scale.shift());}let no = ICNScale[scale.indexOf(base)];q = q.replace(/^9$/,"7(9)").replace(/^add9$/,"9").replace(/^maj$/,"").replace(/^min$/,"m").replace(/^maj7$/,"M7").replace("7sus4","sus4").replace("dim7","dim").replace(/^m7b5|m7\(-5\)|m7\(b5\)$/,"m7-5");if("m,m7,mM7,m9,m6".split(",").includes(q)){minorSignature = "m";q = q.replace("m","");}if("1m,2,3,4m,5m,6,7,1#m,2#m,4#m,5#m,6#m".split(",").includes(no+minorSignature)){swapped = true;}if("7,M7,9,6".split(",").includes(q)){isQAvailable = true;}if("sus4,aug,dim,m7-5".split(",").includes(q)){isQAvailable = true;swapped = false;}else{if(q.length>0){unSupported = true;}}s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!!"+q+"!!]":""));}return s;};let isAutoKeyDetection = true;let key = "";let keyMinorSignature = "";let detectedKey = "";let detectedKeyMinorSignature = "";let chordElms = [];if(document.title.indexOf("U-フレット") != -1){chordElms = chordElms.concat(Array.prototype.slice.bind(document.getElementsByTagName("rt"))());}if(document.title.indexOf("ChordWiki") != -1){chordElms = chordElms.concat(Array.prototype.slice.bind(document.getElementsByClassName("chord"))());}let chords = chordElms.map((e) => e.firstChild.nodeValue);let keyElm = document.getElementsByClassName('key')[0];let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/: ([A-G](#|b){0,1})(m{0,1})$/):null;detectedKey = keyMatch?keyMatch[1]:"";detectedKeyMinorSignature = keyMatch?keyMatch[3]:"";if(detectedKey == ""){let tmpDetectedKey = "";let maxCount = 0;scale.forEach((s) => {key = s;let notSwapCodesCount = chords.slice(0,30).map((s) => module.exports(s)).filter((s) => !(/dim|m7-5|aug/).test(s)).filter((s) => /^([123456][^#~]*$|3~[^#]*$)/.test(s)).length;if(notSwapCodesCount > maxCount){maxCount = notSwapCodesCount;tmpDetectedKey = key;}});key = "";detectedKey = tmpDetectedKey;}var result = prompt("自動検出されたキー:" + detectedKey + "\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。");let resultMatch = result.match(/: ([A-G](#|b){0,1})(m{0,1})$/);let resultKey = keyMatch?keyMatch[1]:"";let resultKeyMinorSignature = keyMatch?keyMatch[3]:"";if(scale.includes(resultKey)){isAutoKeyDetection = false;}if(isAutoKeyDetection){key = detectedKey;keyMinorSignature = detectedKeyMinorSignature;}else{key = resultKey;keyMinorSignature = resultKeyMinorSignature;}chordElms.forEach((e) => {let icn = module.exports(""+e.firstChild.nodeValue);let isSharp = false;let isSwap = false;let isBlueChord = false;if(icn!=""){e.firstChild.nodeValue = icn;if(icn.includes("#")){isSharp = true;}if(icn.includes("~")){isSwap = true;}if("1[7],1#[7],4[7],4#[7],2[M7],2#[M7],3[M7],5[M7],5#[M7],6[M7],6#[M7],7[M7]".split(",").includes(icn) || /\[sus4\]|\[aug\]|\[dim\]|\[m7\-5\]$/.test(icn)){isBlueChord = true;}}if(isSharp&&isSwap){e.classList.add("sharpswap");}else if(isSharp&&!isSwap){e.classList.add("sharp");}else if(!isSharp&&isSwap){e.classList.add("swap");}if(isBlueChord){e.classList.add("bluechord");}else{e.classList.add("notbluechord");}});})();
```

ChordWikiかU-FRETで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

ChordWikiにてKeyが明示されている場合はそれに従い、それ以外はキーを自動判別します。（間違うこともあります）

# 既知のバグ

- https://github.com/inajob/toICN/issues に随時起票しています。（コメント、PR募集してます！）

# 仕様

- ICN、およびこのブックマークレットの仕様については[こちらをご覧ください](/specification.md)。

# 開発方法

- ./src/toICN-before.js
- ./src/toICN-core.js
- ./src/toICN-after.js

を編集してください。

後工程で各行を連結するので行末にセミコロンを必ずつけてください。

`node test.js` でテストを実行できます。

編集が終わったら`gen.sh`を実行してください。下記ファイルが自動生成されます。

- toICN.js
- REAMDE.md

