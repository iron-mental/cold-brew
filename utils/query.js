const rowSplit = (rows, tags) => {
  // 결과, 키 목록, 임시 저장 모델, 저장된 id
  let [result, keys, tempModel, insertedId] = [{}, {}, {}, {}];

  // 사전 작업
  tags.forEach((tag) => {
    result[tag] = [];
    tempModel[tag] = {};
    insertedId[tag] = [];
    keys[tag[0].toUpperCase()] = tag;
  });

  rows.forEach((row, idx) => {
    let temp = tempModel;
    for (const [key, value] of Object.entries(row)) {
      if (idx === 0 && !(key[0] in keys)) {
        result[key] = row[key];
      } else if (key[0] in keys) {
        temp[keys[key[0]]][key.slice(1)] = value;
      }
    }

    for (const [key, value] of Object.entries(temp)) {
      if (insertedId[key].indexOf(value.id) === -1 && Object.keys(value).length && value.id) {
        insertedId[key].push(value.id);
        result[key].push(Object.assign({}, value));
      }
    }
  });
  return result;
};

const toBoolean = (rows, tags) => {
  for (const row of rows) {
    for (const tag of tags) {
      row[tag] = Boolean(row[tag]);
    }
  }
  return rows;
};

const locationMerge = (row) => {
  row.location = {};
  for (const [key, value] of Object.entries(row)) {
    if (key[0] === 'L') {
      row.location[key.slice(1)] = value;
      delete row[key];
    }
  }
  return row;
};

const cutId = (rows) => {
  for (let idx = 10; idx < rows.length; idx++) {
    rows[idx] = rows[idx].id;
  }
  return rows;
};

const customSorting = (rows) => {
  const gu = rows[0][0].region_2depth_name;
  let [targetRows, otherRows] = [[], []];

  rows[1].forEach((row, idx) => {
    if (row.region_2depth_name === gu) {
      targetRows.push(rows[1][idx]);
    } else {
      otherRows.push(rows[1][idx]);
    }
  });

  return targetRows.concat(otherRows);
};

module.exports = {
  rowSplit,
  toBoolean,
  locationMerge,
  cutId,
  customSorting,
};
