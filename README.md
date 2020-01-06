```bash
# 第一次编译
npm install -g @quasar/cli
cd src/frontend
npm install
quasar dev
# Control + C
quasar build

# 第二次编译, 只编译vendor.js
cd ../..
cd src/main/resources/static/js/
vendorname='vendor.*.js'
cp -f $vendorname ../../../../../src/es6-es5/vendor.js
cd ../../../../../src/es6-es5/
npm install
npm run build
cd out
cp vendor.js ../../main/resources/static/js/$vendorname
cd ../../..

```

