
const mapOverAllPads = (port, val) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const k = c + (r * 16);
      port.send([144, k, val])
    }
  }
};

const fullColorMap = (port) => {
  let v = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const k = c + (r * 16);
      port.send([144, k, v])
      v += 1;
    }
  }
};

const colorMap = {
  red: [0, 1, 2, 3],
  green: [0, 32, 64, 124],
  orange: [0, 30, 47, 107],
};

function strobeIterator(port, key, array) {
  let nextIndex = 0;
  let dir = 1
  return {
    next: () => {
      if (dir && nextIndex < array.length - 1) return { value: port.send([144, key, array[nextIndex++]]), done: false }
      else if (nextIndex === array.length - 1) {
        dir = 0;
        return { value: port.send([144, key, array[nextIndex--]]), done: false }
      }
      if (!dir && nextIndex > 0) return { value: port.send([144, key, array[nextIndex--]]), done: false }
      else if (nextIndex === 0) {
        dir = 1;
        return { value: port.send([144, key, array[nextIndex++]]), done: false }
      }
    }
  };
}

const strobeOn = function(port, key, colorStr) {
  const iter = strobeIterator(port, key, colorMap[colorStr || "red"]);
  return setInterval(iter.next, 75);
};

const strobeOff = function(intervalId) {
  return clearInterval(intervalId);
};

const getKey = function({ row, col }) {
  return col + (row * 16);
};

const getVelocity = function(status) {

  const map = {
    "SUCCESS": "green",
    "FAILURE": "red",
    "BUILDING": "orange",
  };

  return colorMap[map[status]][3];
};

module.exports = {
  clearAll: (port) => mapOverAllPads(port, 0),
  fullColorMap: fullColorMap,
  strobeOn: strobeOn,
  strobeOff: strobeOff,
  getKey: getKey,
  getVelocity: getVelocity,
};
