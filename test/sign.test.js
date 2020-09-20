const should = require('should');
const request = require('supertest');
const app = require('../app');

describe('POST /v1/signup', () => {
  it('회원가입시 uid를 보유한 객체를 반환한다', done => {
    request(app)
      .post('/v1/signup')
      .send({
        email: 'user_email@email.com',
        password: 'user_password',
        nickname: 'user_nickname',
      })
      .end((err, res) => {
        result = res.body;
        result.should.be.an.instanceOf(Object).and.have.property('uid');
        result.uid.should.be.an.instanceOf(String);
      });
    done();
  });
});

describe('POST /v1/login', () => {
  it('로그인시 uid를 보유한 객체를 반환한다', done => {
    request(app)
      .post('/v1/login')
      .send({
        email: 'user_email@email.com',
      })
      .end((err, res) => {
        result = res.body;
        result.should.be.an.instanceOf(Object).and.have.property('uid');
        result.uid.should.be.an.instanceOf(String);
      });
    done();
  });
});

// describe('PATCH /v1/update', () => {
//   it('회원정보 수정시 유저 레코드를 반환한다', done => {
//     request(app)
//       .patch('/v1/update')
//       .send({
//         uid: ,
//         contents: {
//           email: 'changed_email@gmail.com',
//         },
//       })
//       .end((err, res) => {
//         result = res.body;
//         result.should.be.an.instanceOf(Object).and.have.property('uid');
//       });
//     done();
//   });
// });

// describe('DELETE /v1/signout', () => {
//   it('로그아웃 성공시 성공했다는 문자열을 반환한다', done => {
//     request(app)
//       .delete('/v1/signout')
//       .send({
//         uid: uid,
//       })
//       .end((err, res) => {
//         result = res.body;
//         result.should.be.an.instanceOf(String);
//       });
//     done();
//   });
// });
