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

let barText = 
'<div class="toicnbar" style="background-color: #f4ffa2; margin: 5px auto; padding: .75rem 1.25rem;">'
+ '<div id="displayedkey" style="font-weight: bold; font-size: 150%; color: #1a4a9c">'
+ '</div>'
+ '<label style = "display: inline-block;">Key:'
+ '<select class="selectedkey" name="selectedkey">'
+ '<option value=-1>Auto(推奨)</option>'
+ '<option value=0>C/Am</option>'
+ '<option value=1>Db/Bbm</option>'
+ '<option value=2>D/Bm</option>'
+ '<option value=3>Eb/Cm</option>'
+ '<option value=4>E/C#m</option>'
+ '<option value=5>F/Dm</option>'
+ '<option value=6>F#/D#m</option>'
+ '<option value=7>G/Em</option>'
+ '<option value=8>Ab/Fm</option>'
+ '<option value=9>A/F#m</option>'
+ '<option value=10>Bb/Gm</option>'
+ '<option value=11>B/G#m</option>'
+ '</select>'
+ '</label>'
+ '<div id="toicnmessage">'
+ '</div>'
+ '</div>';

if(webSiteName == "ufret"){
  let e = document.getElementById('my-chord-data');
  if(e){e.insertAdjacentHTML('beforebegin', barText);}
  else{document.getElementsByClassName('row')[6].insertAdjacentHTML('afterend', barText);}
}
if(webSiteName == "chordwiki"){(document.getElementsByClassName('subtitle'))[0].insertAdjacentHTML('afterend', barText);}
if(webSiteName == "gakki.me"){document.getElementsByClassName("music_func")[0].insertAdjacentHTML('afterend', barText);}
if(webSiteName == "j-total"){document.body.insertAdjacentHTML('afterbegin', barText);}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  waitElement(webSiteName, main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});
}
