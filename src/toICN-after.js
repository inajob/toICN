function main () {
  let detectedKey;
  let originalKey;
  let keyChords;  
  let settings = {
    key: null,
    isAutoKeyDetection: true,
    level: 2,
    minorMode: false,
  };
  // ufretの場合は原曲キーに戻し、押さえ方を非表示にする
  if(webSiteName == "ufret"){
    showChordNameOnly(true);
    try{
      document.getElementsByName("keyselect")[0].options[2].selected = true;
    }catch(e){}
  }

  //ChordやKeyを読む
  let rawKeyChords = exports.readKeyChords(webSiteName);
  keyChords = rawKeyChords.keyChords;
  detectedKey = rawKeyChords.key;

  // キーが書かれていないときは、キーを自動判定する
  if(detectedKey.keyNo == -1){
    detectedKey = exports.autoDetectKey(keyChords);
  }

  // 原曲のキーを取得する
  if(webSiteName == "ufret" || webSiteName =="chordwiki"){
    originalKey = detectedKey;
  }
  if(webSiteName == "gakki.me"){
    try{
      let capoElm = document.getElementsByClassName("gakufu_btn_capo")[0].childNodes[1];
      let capoMatch = capoElm?capoElm.firstChild.nodeValue.match(/^capo (.*)/):null;
      originalKey = new exports.Key(scale[(detectedKey.keyNo + Number(capoMatch[1])+12)%12]);
    }catch(e){
      originalKey = detectedKey;
    }
  }
  if(webSiteName == "j-total"){
    let keyElm;
    try{
      keyElm = document.getElementsByClassName("box2")[0].getElementsByTagName("h3")[0];
    }catch(e){}
    if(!keyElm){ // 古いスタイルのHTMLに対応するため
      keyElm = document.querySelectorAll("tr td font")[5];
    }
    let keyMatch = keyElm?keyElm.firstChild.nodeValue.match(/^Original Key：(.*) \/ Capo/):null;
    originalKey = new exports.Key(keyMatch[1],true);
  }

  //表示書き換え関係

  settings.key = detectedKey;
  
  exports.updateChords(keyChords, settings);
  document.getElementById('displayedkey').innerText = "Original Key: " + originalKey.key;
  document.getElementById('majorlabel').innerText =  "1=" + originalKey.majorScaleName;
  document.getElementById('minorlabel').innerText =  "1=" + originalKey.minorScaleName;

  document.querySelector('.selectedkey').addEventListener('change', (event) => {
    if(event.target.value == -1){ //Auto
      settings.key = detectedKey;
      settings.isAutoKeyDetection = true;
      document.getElementById('displayedkey').innerText = "Original Key: " + originalKey.key;
      document.getElementById('toicnmessage').innerText = "";
      document.getElementById('majorlabel').innerText =  "1=" + originalKey.majorScaleName;
      document.getElementById('minorlabel').innerText =  "1=" + originalKey.minorScaleName;
    
    }
    else{
      settings.key = new exports.Key(scale[event.target.value]);
      settings.isAutoKeyDetection = false;
      document.getElementById('displayedkey').innerText = "Key: " + settings.key.key + " (selected)";
      document.getElementById('toicnmessage').innerText = "toICNのキー変更機能は、キーが正しく認識されなかったときなどに使用するためのものです。\n演奏するキーを変えたい場合は、インスタコード本体のキー設定かカポ機能を利用してください。";
      document.getElementById('majorlabel').innerText =  "1=" + settings.key.majorScaleName;
      document.getElementById('minorlabel').innerText =  "1=" + settings.key.minorScaleName;  
    }
    exports.updateChords(keyChords, settings);
  });
  
  document.querySelector('.selectedlevel').addEventListener('change', (event) => {
    settings.level = event.target.value;
    exports.updateChords(keyChords, settings);
  });

  document.querySelector('.minormode').addEventListener('change', (event) => {
    settings.minorMode = (event.target.value==1);
    exports.updateChords(keyChords, settings);
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
+ '<label style = "display: inline-block;">Level:'
+ '<select class="selectedlevel" name="selectedlevel">'
+ '<option value=1>1(初心者向け)</option>'
+ '<option value=2 selected>2(標準)</option>'
+ '<option value=3>3(オンコード有)</option>'
+ '<option value=4>4(上級者向け)</option>'
+ '</select>'
+ '</label>'
+ ' '
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
+ ' '
+ '<label style = "display: inline-block;">Disp:'
+ '<select class="minormode" name="minormode">'
+ '<option id="majorlabel" value=0></option>'
+ '<option id="minorlabel" value=1></option>'
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
if(webSiteName == "gakki.me"){document.querySelector(".music_func,.fumen_func").insertAdjacentHTML('afterend', barText);}
if(webSiteName == "j-total"){document.body.insertAdjacentHTML('afterbegin', barText);}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  waitElement(webSiteName, main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});
}
