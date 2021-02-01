const should = require('should');
const request = require('supertest');
const app = require('../app');

const token = process.env.access_token;

/* 회원 가입 API */

describe('회원가입 API', () => {
  describe('실패', () => {
    it('이메일 유효성 에러 (422)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'test123email.com', nickname: 'testN', password: 'password123' })
        .end((err, res) => {
          res.statusCode.should.be.equal(422);
          res.body.result.should.be.equal(false);
          done();
        });
    });
    it('닉네임 유효성 에러 (422)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'test123@email.com', nickname: 'testNickname', password: 'password123' })
        .end((err, res) => {
          res.statusCode.should.be.equal(422);
          res.body.result.should.be.equal(false);
          done();
        });
    });
    it('비밀번호 미 입력 유효성 에러 (422)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'test123@email.com', nickname: 'testN', password: '' })
        .end((err, res) => {
          res.statusCode.should.be.equal(422);
          res.body.result.should.be.equal(false);
          done();
        });
    });
  });

  describe('성공', () => {
    it.skip('가입 성공 (201)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'email@email.com', nickname: 'testN', password: 'password123' })
        .end((err, res) => {
          res.statusCode.should.be.equal(201);
          res.body.result.should.be.equal(true);
          done();
        });
    });
  });
});

/* 로그인 API */

describe.skip('로그인 API', () => {
  it('성공', (done) => {
    request(app)
      .post('/v1/user/login')
      .send({
        email: 'rkdcjf0122@naver.com',
        password: 'ql12h',
        push_token: '0fc8b85142dba6a463738ac87ce8f4eee703bd63864fb0011ef45ca424a58067',
        device: 'ios',
      })
      .end((err, res) => {
        console.log('res: ', res.body);
        res.statusCode.should.be.equal(200);
        res.body.data.should.have.properties(['id', 'access_token', 'refresh_token']);
        done();
      });
  });

  it('없는 이메일 (404)', (done) => {
    request(app)
      .post('/v1/user/login')
      .send({
        email: 'rAAAA0122@naver.com',
        password: 'ql512qjsgh',
        push_token: '0fc8b85142dba6a463738ac87ce8f4eee703bd63864fb0011ef45ca424a58067',
        device: 'ios',
      })
      .end((err, res) => {
        res.statusCode.should.be.equal(404);
        done();
      });
  });
  it('비밀번호 오류 (400)', (done) => {
    request(app)
      .post('/v1/user/login')
      .send({
        email: 'rkdcjf0122@naver.com',
        password: 'q124h',
        push_token: '0fc8b85142dba6a463738ac87ce8f4eee703bd63864fb0011ef45ca424a58067',
        device: 'ios',
      })
      .end((err, res) => {
        res.statusCode.should.be.equal(400);
        done();
      });
  });
});

/* 유저 API */

describe('유저조회 API', () => {
  it('성공', (done) => {
    request(app)
      .get('/v1/user/1')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.statusCode.should.be.equal(200);
        res.body.data.should.have.properties(['id']);
        done();
      });
  });
});

describe('유저 sns 수정 API', () => {
  it('성공', (done) => {
    request(app)
      .put('/v1/user/1/sns')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        sns_web: 'https://test@naver.com',
      })
      .end((err, res) => {
        res.statusCode.should.be.equal(200);
        done();
      });
  });
});
