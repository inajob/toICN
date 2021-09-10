let isAutoKeyDetection = true;
let isKeyWritten = false;
let detectedKey;
let keyChords;
let isAutoDetected = false;

function main () {
  //ChordやKeyを読む
  let rawKeyChords = exports.readKeyChords(webSiteName);
  keyChords = rawKeyChords.keyChords;
  detectedKey = rawKeyChords.key;

  // キーが書かれていないときは、キーを自動判定する
  if(detectedKey.keyNo == -1){
    detectedKey = exports.autoDetectKey(keyChords);

    isAutoDetected = true;
  }

  // キーの手動設定
  var result = prompt("Key:" + detectedKey.key + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。\nキャンセルを押すと変換しません。");
  // キャンセルされると置き換えを実行しない
  if (result === null) return;
  let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
  let specifiedKey = new exports.Key(resultMatch?resultMatch[1]:"");
  if(specifiedKey.keyNo != -1){isAutoKeyDetection = false;}

  //表示書き換え関係
  exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
};

function waitElement(cb) {
  let selector;
  if (webSiteName === "ufret") {
    selector = '#my-chord-data .chord ruby rt';
  }
  if (!selector) return cb();

  const timer = setInterval(function () {
    const resolve = function () {
      clearInterval(timer);
      cb();
    };
    if (!!document.querySelector(selector)) resolve();
  }, 300);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  waitElement(main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(main)});
}
