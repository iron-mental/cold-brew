<!-- ![alt sampleImage](https://camo.githubusercontent.com/720ed473d178f9380291709d2223860ade4f3c7bc368e3fea1ad057b8dc9c6f5/68747470733a2f2f6e6f64656a732e6f72672f7374617469632f696d616765732f6c6f676f2d6c696768742e737667) -->

# Terminal :study
> **개발자 스터디 플랫폼 모바일 앱 프로젝트**
</br>

### 프로젝트 개요

**프로젝트 기간**  :  2020.08 ~ 2021.03 </br>
**프로젝트 참여 인원** : Back-End 1명 / iOS 2명 / Android 2명
</br></br>

## 사용한 기술 스택
**Back-End**

```Node.js```
```Javascript```
```JWT```
```Socket.io```
```Express.js```
```FCM```
```APNs```
```Mongoose```
```Winston```
```pm2```
</br>
```AWS EC2```
```Nginx```
```Route53```
```MySQL```
```MongoDB```
```Redis```
</br>

**Development Tool**

```Git & Github```
```Notion```
```Slack```
```Postman```
</br>

**Front-End**

```Next.js```
```Ant Design Component```
</br></br>

[스택쉐어](https://stackshare.io/terminal-study/terminal-study)
</br></br>


## 개발

- 전체적인 서버 구조 및 기능 구현, REST API 구현

- Javascript & Express로 REST API를 활용하여 유저, 스터디 등 전반적인 CRUD 기능 구현
 
- JWT 토큰 인증 과정을 Express Middleware로 하는 인증체계 구축

- Firebase FCM, Apple APNs를 이용한 푸시알림 전송 구현

- Socket.io를 이용한 스터디 멤버 간 실시간 채팅 구현

- Redis를 이용하여 Socket.io 클러스터링 및 Push Badge Count 관리

- Firebase Authentication, Node Mailer를 이용한 이메일 인증 및 계정 비밀번호 관리 구현

- Sentry를 활용하여 에러로그 수집 및 Slack으로 Message 전송 구현

- Next.js & Andt Design Component를 사용하여 랜딩 페이지 개발
</br></br>

## 프로젝트 관리

- Notion을 이용하여 프로젝트 전반적인 기획 및 관리

  - team rule, task 관리, api 문서 등

- Slack을 이용하여 멤버 간 소통 및 서버에서 발생한 에러 확인

- MySQL Workbench를 이용하여 데이터베이스 설계

- 주 단위 회의를 통한 개발 진행관리

- ESLint, Prettier를 이용하여 코드 스타일 관리

- Postman을 이용한 API 테스트 및 문서 공유

- Sentry로 에러로그 수집
</br></br>

## 프로젝트 아키텍쳐

### 3-tier Architecture
Controller - Service - Dao
</br></br>

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



## 설치
- [iOS](https://apps.apple.com/app/id1557178596)
- [Android](https://play.google.com/store/)
- [Web](https://www.terminal-study.tk/)
</br>
