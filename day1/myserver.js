/**/

var http=require("http");
var fs=require("fs");

//http 모듈의 createSever()메소드를 호출하면 server 객체를 반환해 준다
var server=http.createServer(function(request,response){
	response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
	var data = fs.readFileSync("regist_form.html","utf8");
	response.end(data);
});
//서버가동
server.listen(9999,function(){
	console.log("서버가동");
});