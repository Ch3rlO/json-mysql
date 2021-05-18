const fs = require('fs');
const DomainSchema = require('./models/index').Domain;
const InvalidJSONSchema = require('./models/index').InvalidJSON;

const after = process.memoryUsage();
const validJSON = async (arr) => {
  const newArr = [];
  for (const json of arr) {
    try {
      newArr.push(JSON.parse(json));
    } catch (err) {
      await InvalidJSONSchema.create({ value: json });
    }
  }
  return newArr;
};

const initStream = (filename = './inputs/sample.txt') => {
  const readStream = fs.createReadStream(filename, {
    highWaterMark: 0.5 * 1024,
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

initStream();
