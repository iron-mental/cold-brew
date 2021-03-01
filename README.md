<!-- ![alt sampleImage](https://camo.githubusercontent.com/720ed473d178f9380291709d2223860ade4f3c7bc368e3fea1ad057b8dc9c6f5/68747470733a2f2f6e6f64656a732e6f72672f7374617469632f696d616765732f6c6f676f2d6c696768742e737667) -->

# Terminal :study
> **개발 분야 스터디모집 어플리케이션 프로젝트**

![Node Version](https://img.shields.io/badge/node-v12.19.1-green) ![express Version](https://img.shields.io/badge/express-v4.16.1-blue) ![Socket.io Version](https://img.shields.io/badge/Socket.io-v3.0.3-9cf)

"Terminal :study" 는 **개발자들을 위한 스터디모임** 어플리케이션입니다. 간소화 된 양식을 통해 자신을 어필할 수 있는 프로필을 작성할 수 있으며, 스터디에 참여해 활동할 수 있습니다.

프로그래밍 언어, iOS, Android, Bigdata, ML 등 다양한 카테고리가 있으며 자신이 원하는 카테고리의 스터디 목록을 조회하거나 스터디의 정보를 검색해 가입하고 내부 게시판을 통해 스터디의 일정을 조율하고 그룹 채팅을 통해 스터디에 참여할 수 있습니다.
</br></br>

## 설치
- [iOS](https://play.google.com/store/)
- [Web](https://www.terminal-study.tk/)
- [Android](https://www.apple.com/app-store/)
</br>

## 프로젝트 개요

**프로젝트 기간**  :  2020.08.11 ~ 2020.03.08

**서비스 종류** : Mobile Application

**프로젝트 참여 인원** : Back-End 1명 / iOS 2명 / Android 2명

- *강철*  (Back-End)
  - Back-End : Rest-API 개발, 서버 기능 구현
    - 전체적인 서버 구조 및 기능 구현, REST API 구현
    - Javascript & Express로 REST API를 활용하여 유저, 스터디 등 전반적인 CRUD 기능 구현
    - Firebase FCM, Apple APNs를 이용한 푸시알림 전송 모듈 구축
    - JWT 토큰 인증 과정을 Express Middleware로 하는 인증체계 구축
    - Socket.io를 이용한 스터디 멤버 간 의사소통이 가능한 실시간 채팅 기능 구축 
    - Redis를 이용하여 Socket.io 클러스터링 및 Push Badge Count 관리
    - Firebase Authentication, Node Mailer를 이용한 이메일 인증 및 계정 비밀번호 관리 구현
    - Sentry를 활용하여 에러로그 수집 및 Slack으로 Message 전송 구현
  - Front-End
    - Next.js를 활용하여 개발
    - Andt Design Component를 사용하여 레이아웃 개발
  - 배포
    - Server : AWS EC2
    - DB : AWS RDS(MySQL), MongoDB(Atlas), Redis(EC2 내부)
    - Nginx: Reverse Proxy를 이용하여 요청에 맞게 REST API / Landing Page로 분기
</br>

**Terminal: study 주요 기능**

- 이메일 인증 기반 회원가입 / 로그인 / 로그아웃 / 개인정보 수정 / 회원탈퇴
- 스터디 생성/ 수정/ 위임/ 삭제/ 채팅/ 신고
- 스터디 목록 조회 (거리순/ 최신순/ 검색)
- 참여한 스터디 목록 조회
- 스터디 가입 신청/ 취소 및 수락/ 거절
- 공지사항 작성/ 수정/ 삭제

</br>


## 프로젝트 관리

- Notion을 이용하여 프로젝트 전반적인 기획 및 관리

  - team rule, task 관리, api 문서 등

- Slack을 이용하여 멤버 간 소통 및 서버에서 발생한 에러 확인

- MySQL Workbench를 이용하여 데이터베이스 설계

- 주 단위 회의를 진행하여 스프린트 단위의 개발 진행관리

- ESLint, Prettier를 이용하여 코드 스타일 관리

- Postman을 이용한 API 테스트 및 문서 공유

- Sentry로 에러로그 수집
</br>

## 프로젝트 아키텍쳐
![alt sampleImage](https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2018/04/25/overall-ref-arch-1024x581.png)
</br></br>

### 사용한 기술 스택
[Stackshare](https://stackshare.io/terminal-study/terminal-study)

**Common**
- Node.js
- JavaScript

**Back-End**
- Express.js
- JWT
- Multer
- Winston
- Firebase
- APNs
- MySQL
- Redis
- Mongoose
- Socket.io
- Pm2

**Front-End**
- Next.js
- Antd Design Component

**Server**
- AWS EC2, Route53
- Nginx - Reverse Proxy

**DataBase**
- MySQL - RDS
- MongoDB - Atlas
- Redis

**Development Tool**
- Git & Github
- Notion
- Slack
- Postman
</br>


### Directory Structure
```
cold-brew
├─bin
├─configs
├─controllers
├─dao
├─events
├─logs
│  └─error
├─middlewares
│  ├─error_handler
│  └─validators
├─models
├─routes
│  └─v1
├─services
├─test
│  ├─search
│  └─user
└─utils
    ├─errors
    └─variables
```
</br>
