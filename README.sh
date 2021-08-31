cat << EOS
# これは何？

ChordWikiのコード譜の表示をInstaChord（インスタコード）のICNに変換するブックマークレットです。

# 使い方
EOS

echo -n "<a href='"
cat toICN.js
echo -n "'>このリンクをブックマークして下さい</a>"

cat << EOS

ChordWikiで目的の曲を表示した状態で、登録したブックマークをクリックすると、コード表記がICNに変換されます。

EOS

