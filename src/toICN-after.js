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

  let barText = '';
  barText += '<div class="toicnbar">';
  barText += '<div class="dispayedkey" style="font-weight: bold; font-size: 150%;">';
  barText += "Key: " + detectedKey.key;
  barText += '</div>';
  barText += '<label style = "display: inline-block;">Key:';
  barText += '<select class="selectedkey" name="selectedkey">';
  barText += '<option value=-1>Auto</option>';
  barText += '<option value=0>C/Am</option>';
  barText += '<option value=1>Db/Bbm</option>';
  barText += '<option value=2>D/Bm</option>';
  barText += '<option value=3>Eb/Cm</option>';
  barText += '<option value=4>E/C#m</option>';
  barText += '<option value=5>F/Dm</option>';
  barText += '<option value=6>F#/D#m</option>';
  barText += '<option value=7>G/Em</option>';
  barText += '<option value=8>Ab/Fm</option>';
  barText += '<option value=9>A/F#m</option>';
  barText += '<option value=10>Bb/Gm</option>';
  barText += '<option value=11>B/G#m</option>';
  barText += '</select>';
  barText += '</label>';
  barText += '</div>';
  
  if(webSiteName == "ufret"){document.getElementById('my-chord-data').insertAdjacentHTML('beforebegin', barText);}
  if(webSiteName == "chordwiki"){(document.getElementsByClassName('subtitle'))[0].insertAdjacentHTML('afterend', barText);}
  if(webSiteName == "gakki.me"){document.body.insertAdjacentHTML('afterbegin', barText);}
  if(webSiteName == "j-total"){document.body.insertAdjacentHTML('afterbegin', barText);}

  var result = prompt("Key:" + detectedKey.key + (isAutoDetected?"(コード譜を元に自動判定されたキー)":"(Webサイトが指定したキー)") +"\n別のキーを指定したい場合は、下にキーを入力してください。(例:C)\nよくわからなければ、そのままOKを押してください。\nキャンセルを押すと変換しません。");
  // キャンセルされると置き換えを実行しない
  if (result === null) return;
  let resultMatch = result.match(/([A-G](#|b){0,1}m{0,1})$/);
  let specifiedKey = new exports.Key(resultMatch?resultMatch[1]:"");
  if(specifiedKey.keyNo != -1){isAutoKeyDetection = false;}

  //表示書き換え関係
  exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
};

function waitElement(webSiteName, cb) {
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
  waitElement(webSiteName, main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});
}
