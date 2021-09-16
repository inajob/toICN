# ユーザスクリプト(UserScript)について

ユーザースクリプトはブラウザで特定のウェブサイトを開いた際にスクリプトを実行するための仕組みです。現在では各ブラウザで拡張機能を導入することで利用することが出来ます。

toICNのユーザースクリプト版を利用することでコード譜ページを開いたときに、ブックマークレットを実行した時と同じことを自動でやってくれるようになります。

# 各ブラウザ向けおすすめユーザースクリプト拡張機能

[Tampermonkey](https://www.tampermonkey.net/)という拡張がChromeやFirefox、Safari(macOS)向けに提供されています。

## Chrome

[Tampermonkey \- Chrome ウェブストア](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja)

## Edge

[Tampermonkey \- Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

## Firefox

[Tampermonkey – Get this Extension for 🦊 Firefox \(en\-US\)](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

また、Firefoxには老舗のアドオンでGreasemonkeyというものもあります。基本的な使い方はどちらでも同じです。[Greasemonkey – 🦊 Firefox \(ja\) 向け拡張機能を入手](https://addons.mozilla.org/ja/firefox/addon/greasemonkey/) 

## Safari(macOS)

[Tampermonkey • Home](https://www.tampermonkey.net/?browser=safari)

Mac App Storeから入手することも出来ますが、そちらは機能は同じで有料です。 [‎Tampermonkey on the Mac App Store](https://apps.apple.com/app/apple-store/id1482490089?mt=8)

# 導入方法

1. 上記のリンクよりお使いのブラウザに対応した拡張機能をインストールする
2. https://github.com/inajob/toICN/blob/main/toICN.user.js の`Raw`をクリック
  - [![https://github.com/inajob/toICN/blob/main/toICN.user.js上の元ファイルを開くためのリンクの位置を示すスクリーンショット](https://i.gyazo.com/b33d12045a3faba0c4aa36dd10052e9c.png)](https://gyazo.com/b33d12045a3faba0c4aa36dd10052e9c)
3. 拡張機能の画面が開くのでインストールする
  - [![Tampermonkeyのインストール画面](https://i.gyazo.com/d13c44e029ed3290036e629b4019db26.png)](https://gyazo.com/d13c44e029ed3290036e629b4019db26)
4. toICNの対応しているサイトにアクセスすると自動で変換してくれます。上手くいかない場合は何度かリロードしてみてください。

# ⚠ ユーザースクリプトについて

ユーザースクリプトはtoICN以外にも数多くのものが公開されています。中には悪意のあるものもあるので、新規に追加する際は注意してください。


