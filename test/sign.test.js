const should = require('should');
const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  it('문자열을 반환한다', done => {
    request(app)
      .get('/')
      .end((err, res) => {
        console.log(res.text);
        // res.body.should.be.instanceof(Object);
        res.text.should.be.instanceof(String);
      });
    done();
  });
});

// describe('GET /users', () => {
//   describe('성공', () => {
//     it('유저 객체 전부 반환', done => {
//       request(app)
//         .get('/users')
//         .end((err, res) => {
//           res.body.should.be.instanceof(Array);
//           res.body.forEach(user => {
//             user.should.have.property('name');
//           });
//           done();
//         });
//     });
//     it('특정 유저 객체를 반환한다', done => {
//       request(app)
//         .get('/users/1')
//         .end((err, res) => {
//           res.body.should.have.property('id', 1);
//           done();
//         });
//     });
//   });
//   // describe('실패', () => {});
// });
