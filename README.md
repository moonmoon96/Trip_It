<div align="center">
  <img src="https://github.com/user-attachments/assets/818f685b-8970-472b-8cb5-006d3defcdb9" alt="tripitLogo">
</div>

## 🖥 프로젝트 소개

**TRIP IT!** 은  사용자가 여행 일정을 설계하고 커뮤니티 소셜 활동도 즐길 수 있는 여행 스케쥴링 & 커뮤니티 웹 앱 입니다. 


## 💂🏻‍♀️ 팀원소개

| ![suragaryen](https://avatars.githubusercontent.com/u/63506983?v=4) | ![sungjoon92](https://avatars.githubusercontent.com/u/50028595?v=4) | ![Yuurim98](https://avatars.githubusercontent.com/u/83633008?v=4) | ![moonmoon96](https://avatars.githubusercontent.com/u/50128712?v=4) | ![narahub123](https://avatars.githubusercontent.com/u/88291130?v=4) |
|:-------------------------------:|:--------------------------------:|:-------------------------------:|:-------------------------------:|:-------------------------------:|
| [**최수림(BE)**](https://github.com/suragaryen) | [**원성준(BE)**](https://github.com/sungjoon92) | [**최유림(BE)**](https://github.com/Yuurim98) | [**문준현(FE)**](https://github.com/moonmoon96) | [**박나라(FE)**](https://github.com/narahub123) |





## 🛠 기술 스택

| 개발기간 | 2024.06 ~ 2024.08 |
| --- | --- |
| 개발인원 | 5명 |
| 기술스택(BE) | Java(17), SpringBoot(3.2.5), JWT, Gradle, JPA |
| 기술스택(FE) | React(18.3.1), React-route-dom(6.25.1), TypeScript(4.9.5), Axios(1.7.2), firebase(10.12.4)  |
| 데이터베이스 | MariaDB |
| OpenApi | kakao map, kakao mobility, NaverOpenApi, [한국관광공사OpenApi](https://www.data.go.kr/iim/api/selectAPIAcountView.do)  |
| TOOL | GitHub, PostMan, Notion, Discord, SourceTree |
| IDE | Visual Studio Code, IntelliJ |
| API명세 | [ TripIt API 명세서 ](https://docs.google.com/spreadsheets/d/187gMgASjs6wMs96f0oe8W24CEc872nl8lFro1bmjPi4/edit?gid=0#gid=0) |



## 📜 ERD CLOUD
![tripitERDCLOUD](https://github.com/user-attachments/assets/fb0b571f-25bd-4602-89e2-d18bff4370de)


## 🖥 기능 스크린샷

### 회원가입
<img src="https://github.com/user-attachments/assets/23abd89f-3066-4ecf-a5a7-9e7d1db5357b" width="900" height="500" alt="회원가입">

* 유효성 검사를 통해 닉네임과 이메일이 중복일 경우 회원가입 불가능

### 로그인
<img src="https://github.com/user-attachments/assets/f659db95-28cb-4842-8755-fe97c9434959" width="900" height="500" alt="로그인">

* 로그인시 토큰이 발급되며 일정 서비스와 마이페이지 등 회원 서비스 이용 가능함.

<img src="https://github.com/user-attachments/assets/39b2cfa9-e725-484e-96b3-2add553a719a" width="900" height="500" alt="소셜로그인">

* 네이버 OpenApi로 회원 정보를 받아 DB에 저장 후 로그인시 토큰 발급.

### 일정 생성
* 사용자는 여행가고자 하는 지역을 선택 및 검색하여 날짜를 지정할 수 있다 (초성 검색 가능)

<img src="https://github.com/user-attachments/assets/0f08bf9c-0aae-4c22-9d10-c9f0cda3245c" width="900" height="500" alt="지역 선택">

* 사용자가 일정을 지정하면 공공 api를 통해 해당 지역에 대한 관광 목록을 제공한다

<img src="https://github.com/user-attachments/assets/eb563945-0cf5-4229-bd3d-1e9d1706b6fa" width="900" height="500" alt="일정 날짜">

* 사용자가 일정 순서를 수정하면 지도의 경로에도 수정된 일정의 순서로 반영된다

<img src="https://github.com/user-attachments/assets/db89e9e2-8aa3-47ce-9de6-1530253888c2" width="900" height="500" alt="지도">

* 사용자가 검색한 내용을 기반으로 공공 api를 제공한다

<img src="https://github.com/user-attachments/assets/1bd7ac22-943c-4b1c-82bd-6e5620a9ae51" width="900" height="500" alt="일정 검색">

* 드래그 앤 드랍을 통해 일정의 순서 변경이 가능하며 일정을 최종적으로 등록할 수 있다

<img src="https://github.com/user-attachments/assets/a5bdcb1c-eaae-4221-8d70-1a357f6f276e" width="900" height="500" alt="일정 저장">

### 커뮤니티

![무무한스크크롤 (4)](https://github.com/user-attachments/assets/1c09f1d8-42d7-4c6c-b415-2a88af9d22c7)
* 커뮤니티 리스트

<img src="https://github.com/user-attachments/assets/53c96ee4-0e90-423c-8408-bcc95e54012d" width="900" height="500" alt="검색 디테일">

* 전체 또는 여행 지역을 특정지어 검색 기능을 이용할 수 있다.

<img src="https://github.com/user-attachments/assets/6fd603cf-cdd3-4530-9f9d-3ff10d9ec6e2" width="900" height="500" alt="글쓰기">

* 생성된 일정을 불러와 커뮤니티에 글 생성이 가능하다.

<img src="https://github.com/user-attachments/assets/2132360f-ed76-4866-ade9-28c9cd415bf1" width="900" height="500" alt="수정 최종">

* 회원이 작성한 글을 수정할 수 있다.

<img src="https://github.com/user-attachments/assets/3ffdf10d-160c-4ae9-9515-bcd2a3b335ee" width="900" height="500" alt="삭제 모집완료">

* 회원이 작성한 글을 모집완료 처리하고 삭제할 수 있다.

