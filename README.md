# これは何？

ChordWikiのコード譜の表示をInstaChord（インスタコード）のICNに変換するブックマークレットです。

# 使い方

下記をブックマークとして登録してください。

```
javascript:(Array.prototype.slice.bind(document.getElementsByClassName("chord"))().concat(Array.prototype.slice.bind(document.getElementsByTagName("rt"))()).forEach((e) => {let raw = ""+ e.firstChild.nodeValue;let m = raw.match(/^([A-G]m{0,1})([^/]*)/);let s = "-";if(m){let base = m[1];let q = m[2];let swapped = false;let noMap = {"C":1, "D":2, "E":3, "F":4, "G":5, "A":6, "B":7};let no = noMap[base[0]];let isQAvailable = false;if("C,Dm,Em,F,G,Am,Bm".split(",").includes(base)){};if("Cm,D,E,Fm,Gm,A,B".split(",").includes(base)){swapped = true;};if("dim,7,9,M7,sus4,aug".split(",").includes(q)){isQAvailable = true;};s = no + (swapped?"~":"") + (isQAvailable?("["+q+"]"):"");};e.firstChild.nodeValue = s;}))
```

ChordWikiで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

# 既知のバグ

- ハ長調のみ対応しているので、それ以外の曲はChordWikiの移調機能で移調したのちに、このツールを利用してください。

