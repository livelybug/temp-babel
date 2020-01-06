## ES6转ES5

### 第一次编译

```bash
# 第一次编译
npm install -g @quasar/cli
cd src/frontend
npm install
quasar dev
# Control + C
quasar build
```



#### 源码目录

```src/frontend```

#### 问题

* 第一次编译后, 出现的问题是"vendor.XXXXX.js" 没有被转换成ES5. "vendor.XXXXX.js"貌似来自```node_modules``` 下的某个依赖, 但没找出是哪个依赖.



### 第二次编译

```bash
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

#### 源码目录

```src/es6-es5```

#### 问题

* 第二次编译后, IE不兼容, 出现的错误是:

  ```
  "TypeError: Object doesn't support this action
  "Unhandled promise rejection"
  ```



### 尝试过的方法(都失败了)

* 找出哪个依赖是ES6的, 导致第一次编译后的错误
* 在第一次编译时, 把所有的依赖都转成ES5
* 第一次编译后不要最小化,  然后在第二次编译时引用core-js
* 在第一次遍以上引用core-js



## 测试网站

- [http://47.106.197.70:9030](http://47.106.197.70:9030/)
- username：temp           password：Temp-1234