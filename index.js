const fs = require('fs');
const { execSync } = require('child_process');
const DomainSchema = require('./models/index').Domain;
const InvalidJSONSchema = require('./models/index').InvalidJSON;

const after = process.memoryUsage();
const validJSON = async (arr) => {
  const newArr = [];
  for (const json of arr) {
    try {
      newArr.push(JSON.parse(json.replace('\r', '')));
    } catch (err) {
      await InvalidJSONSchema.create({ value: json });
    }
  }
  return newArr;
};

const initStream = (filename = './inputs/sample1.txt') => {
  const readStream = fs.createReadStream(filename, {
    highWaterMark: 3 * 1024,
    encoding: 'utf-8',
  });

  readStream.on('data', async (chunk) => {
    await DomainSchema.bulkCreate(await validJSON(chunk.split('\n')));
    global.gc();
  });

  readStream.on('end', () => console.log({ d: 'ok' }));

  readStream.on('error', function (err) {
    console.log({ err });
    console.log({ before: process.memoryUsage(), after });
  });
};

const initRead = async (filename = './inputs/sample1.txt') => {
  let isCompleted = false;
  let count = 1000;
  while (!isCompleted) {
    let arr = execSync(`cat ${filename} | head -n ${count}`)
      .toString('utf-8')
      .split('\n');
    await DomainSchema.bulkCreate(await validJSON(arr));
    count = count * 2;
    if (arr.length < 1) isCompleted = true;
  }
};

initRead();
