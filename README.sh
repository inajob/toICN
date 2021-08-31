cat << EOS
# これは何？

ChordWikiのコード譜の表示をInstaChord（インスタコード）のICNに変換するブックマークレットです。

# 使い方

下記をブックマークとして登録してください。

\`\`\`
EOS

cat toICN.js

cat << EOS

\`\`\`

ChordWikiで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

EOS

