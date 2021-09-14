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

  //表示書き換え関係
  exports.updateChords(keyChords, isAutoKeyDetection?detectedKey:specifiedKey, isAutoKeyDetection);
  document.getElementById('displayedkey').innerText = "Original Key: " + detectedKey.key;

  document.querySelector('.selectedkey').addEventListener('change', (event) => {
    if(event.target.value == -1){ //Auto
      exports.updateChords(keyChords, detectedKey, true);
      document.getElementById('displayedkey').innerText = "Original Key: " + detectedKey.key;
      document.getElementById('toicnmessage').innerText = "";
    }
    else{
      let selectedKey = new exports.Key(scale[event.target.value]);
      exports.updateChords(keyChords, selectedKey, false);
      document.getElementById('displayedkey').innerText = "Key: " + selectedKey.key + " (selected)";
      document.getElementById('toicnmessage').innerText = "# や ~ の付いたコードがたくさん表示される場合は、選択されたキーが正しくない可能性があります。その場合はKeyをAutoにしてください。";
    }
  });
};

function waitElement(webSiteName, cb) {
  let selector;
  if (webSiteName === "ufret") {
    selector = 'ruby rt';
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

let barText = '';
barText += '<div class="toicnbar" style="background-color: #f4ffa2; margin: 5px auto; padding: .75rem 1.25rem;">';
barText += '<div id="displayedkey" style="font-weight: bold; font-size: 150%; color: #1a4a9c">';
barText += '</div>';
barText += '<label style = "display: inline-block;">Key:';
barText += '<select class="selectedkey" name="selectedkey">';
barText += '<option value=-1>Auto(推奨)</option>';
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
barText += '<div id="toicnmessage">';
barText += '</div>';
barText += '</div>';

if(webSiteName == "ufret"){document.getElementById('my-chord-data').insertAdjacentHTML('beforebegin', barText);}
if(webSiteName == "chordwiki"){(document.getElementsByClassName('subtitle'))[0].insertAdjacentHTML('afterend', barText);}
if(webSiteName == "gakki.me"){document.getElementById('chord_area').insertAdjacentHTML('beforebegin', barText);}
if(webSiteName == "j-total"){document.getElementsByTagName("tt")[0].insertAdjacentHTML('afterbegin', barText);}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  waitElement(webSiteName, main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});
}
