const rowSplit = (rows, tags) => {
  let [result, keys, tmpModel, insertedId] = [{}, {}, {}, {}];

  tags.forEach((tag) => {
    result[tag] = [];
    tmpModel[tag] = {};
    insertedId[tag] = [];
    keys[tag[0].toUpperCase()] = tag;
  });

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
