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

## 注意
1.logScheduler会获取当前正在进行的xhr和图片请求后，将打点事件放入事件队列，当这两种请求数量较少时发送队列中的请求。对于视频流，文件流，websocket繁忙的处理目前未涉及

2.打点请求目前仅支持Image的方式发送，使用xhr和Beacon请求的打点暂不支持
