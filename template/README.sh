cat << EOS
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

\`\`\`
EOS

cat toICN.bookmarklet
cat << EOS

\`\`\`

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

\`node test.js\` でテストを実行できます。

編集が終わったら\`gen.sh\`を実行してください。下記ファイルが自動生成されます。

- toICN.js
- REAMDE.md

EOS

