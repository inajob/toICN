![cover](./imgs/cover.png)

# これは何？

楽譜サイトのコード譜の表示をInstaChord（インスタコード）での演奏に適した表記法である[ICN](http://instachord.com/instruction/icn/) (InstaChord Number) に変換するブックマークレットです。

対応サイトは以下です

- [ChordWiki](https://ja.chordwiki.org/)
- [U-FRET](https://www.ufret.jp/)
- [楽器.me](https://gakufu.gakki.me/)
- [J-Total Music!](https://music.j-total.net/)

# InstaChordの入手

- [InstaChord(インスタコード)の購入はこちら](https://c.affitch.com?ref=QEP6CNKKRACV)
  - アフィリエイトコードが入っています。そういうのが嫌な方は直接検索してください。
  - インスタコードは代理店を持たず[「紹介パートナー制度」](https://instachord.com/overview/d2c/)を採用しています。

# 使い方

下記をブックマークとして登録してください。

```
javascript:(function(){exports = {};let style = document.createElement('style');document.head.appendChild(style);let webSiteName = "";if(document.title.indexOf("U-フレット") != -1){webSiteName = "ufret"};if(document.title.indexOf("ChordWiki") != -1){webSiteName = "chordwiki"};if(document.title.indexOf("楽器.me") != -1){webSiteName = "gakki.me"};if(document.title.indexOf("J-Total Music!") != -1){webSiteName = "j-total"};let sheet = style.sheet;sheet.insertRule('.word {color:#b22222}');sheet.insertRule('.wordtop {color:#b22222}');sheet.insertRule('.sharp {background-color:#dbdbdb}');sheet.insertRule('.swap {background-color:#fab9bd}');sheet.insertRule('.sharpswap {background-color:#d19fa0}');sheet.insertRule('.notsharpswap {background-color:#ffffff}');sheet.insertRule('.bluechord {color:#1a4a9c !important}');sheet.insertRule('.notbluechord {color:#000000 !important}');const scale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];const majorScale = ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];const minorScale = ["A","Bb","B","C","C#","D","D#","E","F","F#","G","G#"];let sharpify = (s) => s.replace("＃","#").replace("♯","#").replace("♭","b").replace("Db","C#").replace("Eb","D#").replace("Fb", "E").replace("Gb","F#").replace("Ab","G#").replace("Bb","A#").replace("Cb", "B");exports.Key = class{constructor(raw="",canDetectMajorOrMinor=false){ let rawMatch = raw.match(/([A-G](#|b|＃|♯|♭){0,1})(.{0,1})/);let tmpKeyNo = rawMatch?scale.indexOf(sharpify(rawMatch[1])):-1;let tmpMinorSignature = rawMatch?rawMatch[3]:"";if(tmpMinorSignature == "m"){tmpKeyNo = (tmpKeyNo+3) %25 12;}this.keyNo = tmpKeyNo;this.minorSignature = canDetectMajorOrMinor?tmpMinorSignature:"u";this.majorScaleName = this.keyNo==-1?"":majorScale[this.keyNo];this.minorScaleName = this.keyNo==-1?"":minorScale[this.keyNo] + "m";if (this.minorSignature == ""){this.key = this.majorScaleName;}else if (this.minorSignature == "m"){this.key = this.minorScaleName;}else{this.key = this.majorScaleName + "/" + this.minorScaleName;}}};exports.readKeyChords = function(webSiteName){let keyElm;let keyChordElms;if(webSiteName == "ufret"){keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("rt"))().map((e => e.firstChild));}if(webSiteName == "chordwiki"){keyChordElms = Array.prototype.slice.bind(document.querySelectorAll('.chord, .key'))().map((e => e.firstChild));keyElm = document.getElementsByClassName('key')[0];}if(webSiteName == "gakki.me"){let elms = Array.prototype.slice.bind(document.querySelectorAll(".cd_fontpos, .cd_font"))();keyChordElms = elms.map((e) => {if(e.firstChild.nodeType == Node.TEXT_NODE){return e.firstChild;}else if(e.firstChild.nextSibling && e.firstChild.nextSibling.nodeType == Node.TEXT_NODE){return e.firstChild.nextSibling;}return null;}).filter((e) => e != null);keyChordElms = keyChordElms.concat(Array.prototype.slice.bind(document.getElementById("chord_area").getElementsByTagName("u"))().map((e => e.firstChild)));}if(webSiteName == "j-total"){keyChordElms = Array.prototype.slice.bind(document.getElementsByTagName("tt")[0].getElementsByTagName("a"))().map((e => e.firstChild));keyElm = document.getElementsByClassName("box2")[0].getElementsByTagName("h3")[0];}let keyChords = keyChordElms?(keyChordElms.map((e) => {if(e){if(e.parentNode.classList.contains("key")){return {type: "key",v: e.nodeValue, elm: e};}return {type: "chord",v: e.nodeValue, elm: e}}else{return null;}}).filter((e) => e != null)):null;let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/(: |：)([A-G](#|b){0,1}m{0,1})$/):null;let detectedKey = new exports.Key(keyMatch?keyMatch[2]:"",true);return {keyChords: keyChords, key:detectedKey};};exports.autoDetectKey = function(keyChords){let maxCount = 0;let chords = keyChords?(keyChords.map((e) => (e.type == "chord")?e:null)):null;scale.forEach((s) => {let tmpKey = new exports.Key(s);let notSwapCodesCount = chords.slice(0,30).map((s) => exports.toICN(s.v,tmpKey)).filter((s) => !(/dim|m7-5|aug/).test(s)).filter((s) => /^([123456][^#~]*$|3~[^#]*$)/.test(s)).length;if(notSwapCodesCount > maxCount){maxCount = notSwapCodesCount;detectedKey = tmpKey;}});return detectedKey;};exports.toICN = function(raw,tmpKey){let ICNScale = ["1","1#","2","2#","3","4","4#","5","5#","6","6#","7"];let m = raw.replace("on","/").match(/^([A-G](#|b|＃|♯|♭){0,1})([^/]*)(\/{0,1})(.*)/);let s = "";if(m){let base = sharpify(m[1]);let minorSignature = "";let q = m[3];let onChord = sharpify(m[5]);let swapped = false;let isQAvailable = false;let unSupported = false;let no = ICNScale[(scale.indexOf(base) + 12 - tmpKey.keyNo)%25 12];let onChordNo = "";if(onChord!=""){onChordNo = ICNScale[(scale.indexOf(onChord) + 12 - tmpKey.keyNo)%25 12];}q = q.replace(/^9$/,"7(9)").replace(/^add9$/,"9").replace(/^maj$/,"").replace(/^min$/,"m").replace(/^maj7$/,"M7").replace("7sus4","sus4").replace("dim7","dim").replace(/^m7b5|m7\(-5\)|m7\(b5\)$/,"m7-5");if(q[0] == "m" && q.indexOf("m7-5") == -1){minorSignature = "m";q = q.replace("m","");}if("1m,2,3,4m,5m,6,7,1#m,2#m,4#m,5#m,6#m".split(",").includes(no+minorSignature)){swapped = true;}if("7,M7,9,6".split(",").includes(q)){isQAvailable = true;}if("sus4,aug,dim,m7-5".split(",").includes(q)){isQAvailable = true;swapped = false;}else{if(q.length>0){unSupported = true;}}s = no+(swapped?"~":"")+(isQAvailable?("["+q+"]"):""+(unSupported?"[!!"+q+"!!]":""))+(onChordNo!=""?"/"+onChordNo:"");}return s;};exports.updateChords = function(keyChords, tmpKey, tmpIsAutoKeyDetection){let currentKey = tmpKey;let previousKey = new exports.Key(); keyChords.forEach((e) => {if(e.type == "key"){if(tmpIsAutoKeyDetection){let tmpKeyMatch = e.v.match(/(: |：)([A-G](#|b){0,1}m{0,1})$/);currentKey = new exports.Key(tmpKeyMatch?tmpKeyMatch[2]:"", true);if(previousKey.keyNo != -1){let keyModulationDegree = currentKey.keyNo - previousKey.keyNo;if(keyModulationDegree >= 7){keyModulationDegree -= 12;}else if(keyModulationDegree <= -6){keyModulationDegree += 12;}e.elm.nodeValue = "Key: " + currentKey.key +" ("+(keyModulationDegree>0?"+":"")+keyModulationDegree+")";}previousKey = currentKey;}}else{let icn = exports.toICN(e.v,currentKey);let isSharp = false;let isSwap = false;let isBlueChord = false;if(icn!=""){e.elm.nodeValue = icn;if(icn.match(/^([1-7])(#{0,1})(~{0,1})/)[2] == "#"){isSharp = true;}if(icn.match(/^([1-7])(#{0,1})(~{0,1})/)[3] == "~"){isSwap = true;}if("1[7],1#[7],4[7],4#[7],2[M7],2#[M7],3[M7],5[M7],5#[M7],6[M7],6#[M7],7[M7]".split(",").includes(icn) || /\[sus4\]|\[aug\]|\[dim\]|\[m7\-5\]$/.test(icn)){isBlueChord = true;}}try{e.elm.parentNode.classList.remove("sharpswap", "sharp", "swap", "notsharpswap", "bluechord", "notbluechord");} catch(error){}if(isSharp&&isSwap){e.elm.parentNode.classList.add("sharpswap");}else if(isSharp&&!isSwap){e.elm.parentNode.classList.add("sharp");}else if(!isSharp&&isSwap){e.elm.parentNode.classList.add("swap");}else{e.elm.parentNode.classList.add("notsharpswap");}if(isBlueChord){e.elm.parentNode.classList.add("bluechord");}else{e.elm.parentNode.classList.add("notbluechord");}}});};let isAutoKeyDetection = true;let isKeyWritten = false;let detectedKey;let keyChords;let isAutoDetected = false;function main () {let rawKeyChords = exports.readKeyChords(webSiteName);keyChords = rawKeyChords.keyChords;detectedKey = rawKeyChords.key;if(detectedKey.keyNo == -1){detectedKey = exports.autoDetectKey(keyChords);isAutoDetected = true;}exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);document.getElementById('displayedkey').innerText = "Original Key: " + detectedKey.key;document.querySelector('.selectedkey').addEventListener('change', (event) => {if(event.target.value == -1){ exports.updateChords(keyChords, detectedKey, true);document.getElementById('displayedkey').innerText = "Original Key: " + detectedKey.key;document.getElementById('toicnmessage').innerText = "";}else{let selectedKey = new exports.Key(scale[event.target.value]);exports.updateChords(keyChords, selectedKey, false);document.getElementById('displayedkey').innerText = "Key: " + selectedKey.key + " (selected)";document.getElementById('toicnmessage').innerText = "# や ~ の付いたコードがたくさん表示される場合は、選択されたキーが正しくない可能性があります。その場合はKeyをAutoにしてください。";}});};function waitElement(webSiteName, cb) {let selector;if (webSiteName === "ufret") {selector = '#my-chord-data .chord ruby rt';}if (!selector) return cb();const timer = setInterval(function () {const resolve = function () {clearInterval(timer);cb();};if (!!document.querySelector(selector)) resolve();}, 300);}let barText = '';barText += '<div class="toicnbar" style="background-color: #f4ffa2; margin-top: 5px; margin-bottom: 5px; padding: .75rem 1.25rem;">';barText += '<div id="displayedkey" style="font-weight: bold; font-size: 150%25; color: #1a4a9c">';barText += '</div>';barText += '<label style = "display: inline-block;">Key:';barText += '<select class="selectedkey" name="selectedkey">';barText += '<option value=-1>Auto(推奨)</option>';barText += '<option value=0>C/Am</option>';barText += '<option value=1>Db/Bbm</option>';barText += '<option value=2>D/Bm</option>';barText += '<option value=3>Eb/Cm</option>';barText += '<option value=4>E/C#m</option>';barText += '<option value=5>F/Dm</option>';barText += '<option value=6>F#/D#m</option>';barText += '<option value=7>G/Em</option>';barText += '<option value=8>Ab/Fm</option>';barText += '<option value=9>A/F#m</option>';barText += '<option value=10>Bb/Gm</option>';barText += '<option value=11>B/G#m</option>';barText += '</select>';barText += '</label>';barText += '<div id="toicnmessage">';barText += '</div>';barText += '</div>';if(webSiteName == "ufret"){document.getElementById('my-chord-data').insertAdjacentHTML('beforebegin', barText);}if(webSiteName == "chordwiki"){(document.getElementsByClassName('subtitle'))[0].insertAdjacentHTML('afterend', barText);}if(webSiteName == "gakki.me"){document.getElementById('chord_area').insertAdjacentHTML('beforebegin', barText);}if(webSiteName == "j-total"){document.body.insertAdjacentHTML('afterbegin', barText);}if (document.readyState === 'complete' || document.readyState === 'interactive') {waitElement(webSiteName, main);} else {document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});}})();
```

対応サイトの楽曲ページで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

ChordWikiにてKeyが明示されている場合はそれに従い、それ以外はキーを自動判別します。（間違うこともあります）

# 動画説明

![tutorial](./imgs/tutorial.gif)

# スマートフォン・タブレットでの利用

FirefoxやChromeで動作します。

AndroidのChromeで実行する際は「ブックマークレットのタイトルをアドレスバーに入力」してブックマークレットを実行してください。
（ブックマークメニューから、選択しても実行されないようです。）

参考: https://ametuku.com/archives/6858

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

