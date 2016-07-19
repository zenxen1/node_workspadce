/*
http 내장 모듈로만은 완전한 웹서버를 구축하기엔 너무나 부족하다
따라서 express모듈을 사용해 보자!!
express모듈이란? 웹서버 구축에 필요한 기능들을 위한 http모듈에 추가시켜놓은 외부 모듈...
(http의 업그레이드 모듈 but 2모듈은 같이 사용 한다..)
*/

var http=require("http");
var express = require("express");
var fs = require("fs");
var mysql=require("mysql");
var bodyParser=require("body-parser");
var ejs = require("ejs");

//express모듈로 부터 application 객체를 반환 생성하자...
var app=express();

app.use(bodyParser.json()); //json 지원
app.use(bodyParser.urlencoded({extended:true}));//form 태그로 전송될 경우 이속성 지정해야 함.


//mysql 접속
var client = mysql.createConnection({
	"url":"localhost",
	"user":"root",
	"password":""
});

client.query("use iot");

//게시물 목록 보기 요청 처리
app.route("/list").get(function(request,response){
	var page = fs.readFileSync("./list.html","utf8");

	client.query("select * from student",function(error,records){
		if(!error){
			console.log(records);
			response.writeHead(200,{"Contend-Type":"text/html;charset=utf-8"});
			response.end(ejs.render(page,{dataList:records}));

		}else{
			console.log("망했어요");
		}
		
	});
	
	
});

//application 객체란? 웹서버 역활을 담당할 객체
//웹서버 역할이란?? 요청에 대해 응답을 처리하는 역활 ...
/*
app.use(function(request,response){
	response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
	response.end("express 모듈로 구출한 서버의 응답메세지");
});
*/
//app.use()메서드 안에는 미들웨어라고 불리는 각종 express의 지원함수들이 자리 잡을 수 있다.

//라우팅 미들웨어를 사용해본다 : route란 방향을 잡는 것을 말하고,
//Nodejs에서는 원하는 페이지를 나오게 처리해 준다...
//app.use(app.router);//라우팅시 함수() 표시 x

//클라이언트가 get방식으로 요청을 시도하면 동작하게 될 메서드!!!

app.route("/regist_form").get(function(request,response){
	//console.log("노랑페이지를 원합니까");
	var data = fs.readFileSync("./regist_form.html","utf8");
	response.writeHead(200,{"Contend-Type":"text/html;charset=utf-8"});
	response.end(data);
});

/*(var router=app.route("/regist_form.html");
app.get("/regist_form.html",function(request,response){
	//console.log("노랑페이지를 원합니까");
	var data = fs.readFileSync("./regist_form.html","utf8");
	response.writeHead(200,{"Contend-Type":"text/html;charset=utf-8"});
	response.end(data);
});
*/

//클라이언트가 등록을 원하면...post방식으로 요청할 경우 서버에서는 post()메서드로 받아야한다!!
app.route("/regist").post(function(request,response){
	//클라이언트가 보낸 데이터를 받고!!
	//express모듈 사용시 request가 업그레이드가 되었기 때문에 param()메서드를 사용할 수 있다.
	//받은 데이터를 데이터베이스에 넣는다!!

	//console.log(request.body);
	var data = request.body;

	var id = data.id;
	var pwd = data.pwd;
	var name = data.name;

	console.log("넘겨받은 아이디는"+id);
	console.log("넘겨받은 패스워드는"+pwd);
	console.log("넘겨받은 이름는"+name);

	//받은 데이터를 데이터베이스에 넣는다
	//쿼리문 수행후 두번쨰 인수인 익명함수가 작동한다...개발자는 여기서 등록 성공 or 실패 여부를 확인할수 있다
	client.query("insert into student(id,pwd,name) values('"+id+"','"+pwd+"','"+name+"')",function(error,records,field){
		if(error){
			console.log("등록 실패 입니다.");
		}else{
			console.log("등록 성공 입니다.");
		}
		
		response.redirect("/list");
	});

});

//상세보기 요청이 들어오면
app.route("/detail/:id").get(function(request,response){
	var data = fs.readFileSync("./detail.html","utf8");
	
	client.query("select * from student where id='"+request.params.id+"'",function(error,records){
		if(!error){
			console.log(records);
			response.writeHead(200,{"Contend-Type":"text/html;charset=utf-8"});
			response.end(ejs.render(data,{obj:records}));
		}else{
			console.log("일치하는 데이터를 발견할 수 없네요");
		}
	});
	console.log("유저가 서버로 요구한 "+request.params.id);
	
	
	
});

//상세보기 요청이 들어오면
app.route("/delete/:id").get(function(request,response){
	var id = request.params.id
	client.query("delete from student where id='"+id+"'",function(error,records){
	if(!error){
		response.redirect("/list");
	}else{
		console.log("삭제실패!!");
	}


	});
	
});


//서버 구동 시작
var server = http.createServer(app);
server.listen(8383,function(){
	console.log("Server is runing at 8383.....");
});