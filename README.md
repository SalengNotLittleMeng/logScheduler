# logScheduler

打点请求后置器，在初始化后，自动将项目中符合配置要求的Image请求后置，只有当前网络请求数较少时才会执行这些请求，避免同一时间的请求过多导致网络拥塞

## 使用
```js
 import logScheduler from 'logScheduler';
  const scheduler= new logScheduler({
    // log的正则，会对每个请求用这个正则进行匹配，匹配成功的会被标记为打点请求，延迟执行
      log:/.jpg/  ,
    //   当正在执行的请求小于等于设定值时触发打点，默认是3
      trigger:3
    });
```