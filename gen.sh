#!/bin/bash

echo -n "javascript:(function(){" > toICN.js
cat ./src/toICN-before.js |sed -e 's/\/\/.*//'|sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
cat ./src/toICN-core.js |sed -e 's/\/\/.*//'|sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
cat ./src/toICN-after.js |sed -e 's/\/\/.*//'|sed -e 's/^ *//g'|tr -d '\n' >> toICN.js
echo -n "})();" >> toICN.js

cat toICN.js | sed -e 's/%/%25/g' > toICN.bookmarklet


cat ./src/toICN-before.js > toICN-debug.js
cat ./src/toICN-core.js >> toICN-debug.js
cat ./src/toICN-after.js >> toICN-debug.js

./template/README.sh > README.md
