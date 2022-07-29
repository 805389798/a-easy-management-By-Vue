const objectIsEmpty = data => {
  if (JSON.stringify(data) === '{}') {
    return true;
  } else {
    let result = true;
    for (let item of Object.values(data)) {
      if (item == null) {
        item = [];
      }
      if (item != '' && item != []) {
        result = false;
      }
    }
    return result;
  }
};

export default objectIsEmpty;
