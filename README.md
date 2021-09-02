# これは何？

[ChordWiki](https://ja.chordwiki.org/)と[U-FRET](https://www.ufret.jp/)のコード譜の表示をInstaChord（インスタコード）での演奏に適した表記法であるICNに変換するブックマークレットです。

# 使い方

下記をブックマークとして登録してください。

```
javascript:(Array.prototype.slice.bind(document.getElementsByClassName("chord"))().concat(Array.prototype.slice.bind(document.getElementsByTagName("rt"))()).forEach((e) => {let raw = ""+ e.firstChild.nodeValue;let m = raw.match(/^([A-G])(#|b{0,1})(m{0,1})([^/]*)/);let s = "-";if(m){let base = m[1];let keySignature = m[2];let minorSignature = m[3];let q = m[4];let swapped = false;let noMap = {"C":1, "D":2, "E":3, "F":4, "G":5, "A":6, "B":7};let no = noMap[base];let isQAvailable = false;let unSupported = false;let isSharp = false;if(keySignature == "#"){if(no == 3){no = 4;}else if(no == 7){no = 1;}else{isSharp = true;}}else if(keySignature == "b"){if(no == 1){no = 7;}else if(no == 4){no--;}else{no--;isSharp = true;}}if("1m,2,3,4m,5m,6,7".split(",").includes(no+minorSignature)){swapped = true;}q = q.replace("7sus4","sus4").replace("dim7","dim").replace("7-5","m7-5");if("7,M7,9,6".split(",").includes(q)){isQAvailable = true;}else if("sus4,aug,dim,m7-5".split(",").includes(q)){isQAvailable = true;swapped = false;} else{if(q.length>0){unSupported = true;}}s = no + (swapped?"~":"") +(isSharp?"[#]":"") + (isQAvailable?("["+q+"]"):"" + (unSupported?"[!!"+q+"!!]":""));e.firstChild.nodeValue = s;}}))
```

ChordWikiかU-FRETで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

# 既知のバグ

- KEY:C（ハ長調）のみに対応しているので、それ以外の曲はChordWikiやU-FRETの移調機能で移調したのちに、このツールを利用してください。
- https://github.com/inajob/toICN/issues に随時起票しています。（コメント、PR募集してます！）

