/*
내장모듈 중 os모듈을 사용해 보기!!
*/

var os = require("os");
// console.log(os.cpus()); cpu정보

//메모리정보
//console.log(os.freemem()/1024/1024 + "Mbyte");

console.log(os.platform());