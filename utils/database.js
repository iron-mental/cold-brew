const rowSplit = (rows, tags) => {
  // 결과, 키 목록, 임시 저장 모델, 저장된 id
  let [result, keys, tmpModel, insertedId] = [{}, {}, {}, {}];

  // 사전 작업
  tags.forEach((tag) => {
    result[tag] = [];
    tmpModel[tag] = {};
    insertedId[tag] = [];
    keys[tag[0].toUpperCase()] = tag;
  });

  // 메인 루프
  rows.forEach((row, idx) => {
    let tmp = tmpModel;
    for (const [key, value] of Object.entries(row)) {
      if (idx === 0 && !(key[0] in keys)) {
        result[key] = row[key];
      } else if (key[0] in keys) {
        tmp[keys[key[0]]][key.slice(1)] = value;
      }
    }

    for (const [key, value] of Object.entries(tmp)) {
      if (insertedId[key].indexOf(value.id) === -1 && Object.keys(value).length && value.id) {
        insertedId[key].push(value.id);
        result[key].push(Object.assign({}, value));
      }
    }
  });
  return result;
};

module.exports = { rowSplit };
