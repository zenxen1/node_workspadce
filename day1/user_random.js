//외부의 필요한 모듈을 사용하기 위해서는 require 함수안에
//필요한 모듈명을 명시하면 된다...
var mm = require("./mymodule");

//모듈 사용해 보기~~
function ran(){
	var r = mm.getRandom(5);
	console.log("5에대한 랜덤값은" + r);

	setTimeout(function(){
		ran();
	},500);
}

ran();

var str = mm.getExtend("test.png");
console.log(str);
