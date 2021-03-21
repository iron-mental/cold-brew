<!-- ![alt sampleImage](https://camo.githubusercontent.com/720ed473d178f9380291709d2223860ade4f3c7bc368e3fea1ad057b8dc9c6f5/68747470733a2f2f6e6f64656a732e6f72672f7374617469632f696d616765732f6c6f676f2d6c696768742e737667) -->

# Terminal :study
>개발자 스터디 플랫폼 모바일 앱 프로젝트</br>
[Appstore](https://apps.apple.com/app/id1557178596)  | 
[Playstore](https://play.google.com/store/)  | 
[Landing Page](https://www.terminal-study.tk/)  | 
[Notion](https://www.notion.so/Main-d0d4c0ecf4d744b180645abca77a9784)
</br>

```
2021년은 '개발자 전성시대'
요즘 핫하게 떠오르는 코딩을 배우고 싶으신가요?
혼자 코딩 공부하는게 어려우신가요?

터미널의 스터디 모임을 통해서 당신의 꿈을 펼쳐보세요

* 터미널은 개발자들에게 친숙한 리눅스 터미널, 많은 이들이 한데 모여 여정을 떠나는 터미널이라는 뜻을 모아
개발자들이 한데 모여 같은 목적(스터디, 개발)을 한다는 의미를 담고 있습니다.

1. 스터디 검색
 - 원하는 키워드로 스터디를 검색해보세요. 당신의 가입을 기다리고 있습니다.
 - 자신의 지역을 통해 가장 가까운 스터디 모임부터 보여드립니다. 여러분을 기다리는 멤버들이 생각보다 가까이 있어요.
 - iOS, Android, Back-end, Language, AI 등 개발종류에 따라 스터디 검색이 가능합니다. 입맛대로 골라보세요.

2. 스터디 개설
 - 원하는 스터디를 못찾겠다면 직접 스터디 모임을 개설해 멤버들을 모집해보세요.

3. 스터디 참여
 - 채팅, 공지사항, 스터디 정보를 통해 멤버들과 소통해보세요.
 - 멤버들과 함께 목표를 이루도록 노력해요.

4. 프로필 작성
 - 경력, 프로젝트, 소개를 통해서 자신의 능력을 어필해보세요. 스터디 승인률이 높아집니다.
```

</br>

## 프로젝트 개요

**프로젝트 기간**  :  2020.08 ~ 2021.03 </br>
**프로젝트 참여 인원** : Back-End 1명 , iOS 2명 , Android 2명
</br></br>

## 사용한 기술 스택
**Back-End**

```Javascript```
```Node.js```
```Nginx```
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

<!--[스택쉐어](https://stackshare.io/terminal-study/terminal-study)</br></br>-->


## 개발

Javascript & Express로 REST API를 활용하여 유저, 스터디 등 전반적인 CRUD 기능 구현

Socket.io를 이용한 스터디 멤버 간 실시간 채팅 구현
 
JWT 토큰 인증 과정을 Express Middleware로 하는 인증체계 구축

Firebase FCM, Apple APNs를 이용한 푸시알림 전송 구현

Redis를 이용한 Push Badge Count 관리 및 Socket.io 클러스터링

Firebase Authentication, Node Mailer를 이용한 이메일 인증 및 계정 관리 구현

Sentry를 활용한 에러로그 수집 및 Slack으로 Message 전송 구현

Next.js & Andt Design Component를 사용하여 랜딩 페이지 개발
</br></br>

## 프로젝트 관리

Notion을 이용하여 프로젝트 전반적인 기획 및 관리

- team rule, task 관리, api 문서 등

Slack을 이용하여 멤버 간 소통 및 서버에서 발생한 에러 확인

MySQL Workbench를 이용하여 데이터베이스 설계

주 단위 회의를 통한 개발 진행관리

ESLint, Prettier를 이용하여 코드 스타일 관리

Postman, Notion을 이용한 API 테스트 및 문서 공유

Sentry, Slack으로 실시간 에러 관리
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

## 프로젝트 IA
![터미널 IA](https://user-images.githubusercontent.com/61345745/111910514-08fd7f80-8aa5-11eb-8d11-684bae814802.png)
