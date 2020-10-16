const rowSplit = (userData, tags = []) => {
  let count = 0;
  const items = {}; // make matching k-v
  const result = {}; // 메인 저장소 result
  const resultedId = {}; // 중복검사

  for (const tag of tags) {
    items[tag] = tag.slice(0, 1).toUpperCase().concat('_');
    result[tag] = [];
    resultedId[tag] = [];
  }

  // rows FOR문
  for (const data of userData) {
    // 담을 변수 선언
    let tmp = {};
    for (let name in items) {
      tmp[name] = {};
    }

    // row FOR문
    for (const key in data) {
      // 메인 데이터인지 확인
      if (key.slice(0) === key.slice(0).toLowerCase() && count < 1) {
        result[key] = data[key];
      } else {
        // items의 값과 매칭
        for (let name in items) {
          // if (key.slice(0, 2) === items[name] && data[key]) { // null을 안받는 구문, 아니면 null이면 데이터를 변환하는것을 넣을까?
          if (key.slice(0, 2) === items[name]) {
            tmp[name][key.slice(2)] = data[key];
          }
        }
      }
    }

    //담은 변수들 result에 병합
    for (const name in items) {
      // 하위 row의 길이체크, 이미 들어간 내용과 동일한지, 해당 row의 id가 null이 아닌지 체크
      if (Object.keys(tmp[name]).length && resultedId[name].indexOf(tmp[name].id) === -1 && tmp[name].id !== null) {
        result[name].push(tmp[name]);
        resultedId[name].push(tmp[name].id);
      }
    }
    count += 1;
  }
  return result;
};

module.exports = { rowSplit };

/* 해당 유틸의 example
const userData = [
  {
    id: 1,
    name: 'kang',
    P_id: 'pid',
    P_name: 'pname',
    T_id: 'tid',
    T_name: 'tname',
  },
  {
    id: 1,
    name: 'kang',
    P_id: 'pid2',
    P_name: 'pname2',
    T_id: 'tid2',
    T_name: 'tname2',
  },
];
const items = ['project', 'team'];
const res = testFunction(userData, items);
## 결과 ##
result: { 
  project:
  [
    { id: 'pid', name: 'pname' },
    { id: 'pid2', name: 'pname2' }
  ],
  team:
  [
    { id: 'tid', name: 'tname' },
    { id: 'tid2', name: 'tname2' }
  ],
  id: 1,
  name: 'kang'
*/

// let count = 0;
// const object1 = {
//   a: 'somestring',
//   b: 42,
// };

// for (const [key, value] of Object.entries(object1)) {
//   console.log(`${key}: ${value}`);
// }
