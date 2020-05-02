/**
 * 将vue 更改的部分复制过来
 */
const ncp = require('ncp').ncp;
const fs = require('fs');

const path = require('path');

const list = [
  {
    source: '../src/platforms/web',
    destination: './platforms/web',
  },
  {
    source: '../src/core/vdom',
    destination: './core/vdom',
  },
];
const options = {
  clear: true,
  ncpOptions: {
    clobber: true,
    stopOnErr: true,
  },
};
list.forEach((data) => {
  let { source, destination } = data;
  source = path.resolve(source);
  destination = path.resolve(destination);
  if (options.clear) {
    emptyDir(destination);
    console.log('清空目标文件夹成功!');
  }
  copyTo(source, destination, options.ncpOptions, () => {
    console.log('复制到目标文件夹成功!');
  });
});

function emptyDir(dir, cb) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const curentPath = path.join(dir, file);
    const stat = fs.statSync(curentPath);
    if (stat.isDirectory()) {
      fs.rmdirSync(curentPath, {
        recursive: true,
      });
    } else fs.unlinkSync(curentPath);
  }
}

function copyTo(source, destination, options = {}, cb) {
  ncp(source, destination, options, (err) => {
    if (err) throw err;
    if (typeof cb === 'function') cb();
  });
}
