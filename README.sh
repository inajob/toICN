cat << EOS
# これは何？

[ChordWiki](https://ja.chordwiki.org/)と[U-FRET](https://www.ufret.jp/)のコード譜の表示をInstaChord（インスタコード）での演奏に適した表記法である[ICN](http://instachord.com/instruction/icn/) (InstaChord Number) に変換するブックマークレットです。

# 使い方

下記をブックマークとして登録してください。

\`\`\`
EOS

cat toICN.js

cat << EOS

\`\`\`

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

\`node test.js\` でテストを実行できます。

編集が終わったら\`gen.sh\`を実行してください。下記ファイルが自動生成されます。

- toICN.js
- REAMDE.md

EOS

