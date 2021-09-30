function main () {
  //ChordやKeyを読む
  let rawKeyChords = exports.readKeyChords(webSiteName);
  
  //設定情報を読み取り、chordを書き換え
  exports.updateSettings(rawKeyChords);

  //設定の書き換えがあった場合は、同様の処理を行う
  document.querySelector('.selectedkey').addEventListener('change', (event) => {
    exports.updateSettings(rawKeyChords);
  });
  
  document.querySelector('.selectedlevel').addEventListener('change', (event) => {
    exports.updateSettings(rawKeyChords);
  });

  document.querySelector('.minormode').addEventListener('change', (event) => {
    exports.updateSettings(rawKeyChords);
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

exports.addToICNBar();

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  waitElement(webSiteName, main);
} else {
  document.addEventListener('DOMContentLoaded', function () {waitElement(webSiteName, main)});
}
