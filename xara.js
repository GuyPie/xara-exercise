console.time("script");

const origDataPoints = require('./data_points.json');
// const origDataTree = require('./data_tree.json');

let sortedDataPoints = origDataPoints
  .map((a) => {
    a.dashCount = a.tier.match(/-/g).length
    return a;
  })
  .sort((a, b) => a.start - b.start + a.dashCount - b.dashCount)
  .map((a) => {
    delete a.dashCount;
    return a;
  });

const firstDataPoint = sortedDataPoints.shift();
firstDataPoint.children = [];
const result = buildDataTree(sortedDataPoints, [firstDataPoint]);

function buildDataTree(currDataPoints, possibleParents) {
  if (!currDataPoints.length) return [possibleParents[0]];

  const dataPoint = currDataPoints.shift();
  dataPoint.children = [];

  for (let i = possibleParents.length - 1; i < possibleParents.length; i--) {
    let possibleParent = possibleParents[i];

    if (dataPoint.tier.startsWith(possibleParent.tier)) {
      if (dataPoint.tier.length !== possibleParent.tier.length) {
        possibleParents.push(dataPoint);
      }

      possibleParent.children.push(dataPoint);
      break;
    }
  }

  return buildDataTree(currDataPoints, possibleParents);
}

// console.log(JSON.stringify(result) === JSON.stringify(origDataTree));
console.timeEnd("script");