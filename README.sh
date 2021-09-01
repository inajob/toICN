cat << EOS
# これは何？

[ChordWiki](https://ja.chordwiki.org/)と[U-FRET](https://www.ufret.jp/)のコード譜の表示をInstaChord（インスタコード）のICNに変換するブックマークレットです。

# 使い方

下記をブックマークとして登録してください。

\`\`\`
EOS

cat toICN.js

cat << EOS

\`\`\`

ChordWikiかU-FRETで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

# 既知のバグ

- KEY:C のみ対応しているので、それ以外の曲はChordWikiやU-FRETの移調機能で移調したのちに、このツールを利用してください。

EOS

