/*-----------------------------------------------------
Nodejs 서버 구축 !!
필요한 모듈(객체,각종 함수 등이 모여있는 라이브러리를 의미)

웹서버를 구축을 위해 필요한 모듈
내 http(필수)-요청,응답을 처리하는 모듈!!
외 express - (http에 보완 모듈)
내 fs - html 문서를 보여주기 위한 파일 제어 모듈 
내 router - 요청 url을 분석하여 알맞는 처리를 담당 및 요청,응답에 필요한 부가적 기능을 보유한 모듈..
외 mysql - mysql 데이터베이스 핸들링 모듈...
외 body-parser - post방식으로 데이터를 전송해 올때, 그 데이터를 분석해 주는 객체
외 ejs - html 코드내에 동적 프로그래밍 코드를 삽입할 수 있는 모듈
1번
--------------------------------------------------------*/
var http = require("http");
var express = require("express");
var fs = require("fs");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var ejs = require("ejs");

var app=express(); //express 모듈 얻기

/*mysql 서버 접속
	접속후 반환되는 client객체를 이용하여 퀘리문을 수행 할 수 있다.
*/
var client = mysql.createConnection({
	url : "localhost",
	user : "root",
	password : ""
});
client.query("use iot"); //데이터베이스 선택





/*
정적자원(이미지,css,js,음원,html등)을 접근하기 위한 경로 설정
express 모듈에 삽입할 수 있는 부가적 함수들을 가리켜 미들웨어라 한다!!
*/
app.use(express.static(__dirname));//루트를 지정

/*
요청 URL에 따른 알맞는 처리 (router 모듈 이용)
/board/writeform : 글쓰기 폼 요청이 들어오면 내부 함수가 처리 하겠다
3번*/



app.route("/board/writeForm").get(function(request, response){
	//지정한 파일 읽어 들여서 변수로 담아놓자!!
	var content = fs.readFileSync("./board/write.html","utf8");
	response.writeHead(200,{"Content-Type" : "text/html;charset=utf-8;"});
	response.end(content);

});

app.use(bodyParser.json()); //제이슨 형태로 테이터 처리
app.use(bodyParser.urlencoded({extended:true})); //form 데이터를 받겠다



//4번 글쓰기 요청을 처리
app.route("/board/write").post(function(request, response){
	
	//폼양식으로부터 전송되어온 입력 양식 파라미터들을 받아서
	
	//mysql에 입력한다~!
	console.log(request.body);
	
	var sql="insert into board(writer,title,content)";
	sql = sql + " values('"+request.body.writer+"','"+request.body.title+"','"+request.body.content+"')";
	console.log(sql);
	client.query(sql,function(error,data,fields){
		if(!error){
			console.log("입력성공");
			
			//var content = fs.readFileSync("./board/list.html","utf8");
			//response.end(content);
			
			//응답을 받는 클아이언트의 브라우저는 지정한 url로 다시 접속하라는 명령
			response.redirect("/board/list");
		}else{
			console.log("입력실패");
			response.writeHead(200,{"Content-Type" : "text/html;charset=utf-8;"});
			var content = fs.readFileSync("./board/list.html","utf8");
			response.end(content);
		}
	});
	
	//지정한 파일 읽어 들여서 변수로 담아놓자!!
	

});

/*---------------------------------------------
5번 board/list 요청을 처리
----------------------------------------------*/
app.route("/board/list").get(function(request,response){
	response.writeHead(200,{"Content-Type" : "text/html;charset=utf-8;"});



	//db를 조회하여 레코드를 가져와서. list.html에 전달 !!
	//데이터 전달을 위해서는 ejs 모듈이 사용된다!!
	client.query("select * from board order by board_id desc",function(error,records){
		console.log(records);

		var content = fs.readFileSync("./board/list.html","utf8");

		//서버에서 ejs 문법을 먼저 실행시켜야 한다!!
		// <%%> 영역이 수행되게 하기 위해
		response.end(ejs.render(content, {dataList:records}));

	});

});


//2번 9999 서버가동
var server = http.createServer(app);
server.listen(9999,function(){
	console.log("Sever is runnig at 9999....");
});



