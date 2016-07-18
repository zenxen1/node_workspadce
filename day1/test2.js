/*
nodejs가 자바스크립트이긴 하나, 기존 자바스크립트에는 없는
기능들이 있다. 그중 전역변수와 전역함수를 학습한다!!!
__filename : 현재 실행하고 있는 파일의 완전한 경로
__dirname : 현재 실행하고 있는 파일의 디렉토리 경로
*/
console.log("__filename 은"+__filename);
console.log("__dirname 은"+__dirname);//디렉토리의 full경로만 출력~!
/*
1.__filename 을 이용한 경로에서 파일명만 출력하시오.
2.파일명과 확장자를 분리하여 출력하시오.
*/
var str=__filename;
var filename = str.substring(str.lastIndexOf("\\")+1,str.length);
console.log("추출된 파일명은"+filename);

var arr =filename.split(".");//.점을 기준으로 나눠진 스트링에 대한 배열이 반환됨..
console.log(arr[0]);
console.log(arr[1]);