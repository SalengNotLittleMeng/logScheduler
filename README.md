# logScheduler

打点请求后置器，在初始化后，自动将项目中符合配置要求的url接口进行调度，只有当前网络请求数较少时才会执行这些请求，避免同一时间的请求过多导致网络拥塞

## 使用
```js
 import logScheduler from 'logScheduler';
  const scheduler= new logScheduler({
    // log的正则，会对每个请求用这个正则进行匹配，匹配成功的会被标记为打点请求，延迟执行
      log:/.jpg/  ,
    //   当正在执行的请求小于等于设定值时触发打点，默认是3
      trigger:3
    });
    // 动态添加调度目标，可以用于预加载
    scheduler.prefetch('https://jsonplaceholder.typicode.com/todos/2')
```

## 调试

克隆仓库后使用npm i 或yarn 安装依赖，然后执行npm run dev 命令，即可开始调试，修改代码后即可自动执行打包

可以通过example目录下的index.html来验证打包后的项目功能

## 注意
1.logScheduler会获取当前正在进行的xhr和图片请求后，将打点事件放入事件队列，当这两种请求数量较少时发送队列中的请求。对于视频流，文件流，websocket繁忙的处理目前未涉及

2.打点请求目前仅支持Image和XHR两种方式，Beacon请求的打点暂不支持
