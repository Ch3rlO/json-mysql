const fs = require('fs');
const DomainSchema = require('./models/index').Domain;
const InvalidJSONSchema = require('./models/index').InvalidJSON;

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
    highWaterMark: 10 * 1024,
  });

  readStream.on('data', async (chunk) => {
    const arr = chunk.toString('utf-8').split('\n');
    await DomainSchema.bulkCreate(await validJSON(arr));
    global.gc();
  });

  readStream.on('end', () => console.log({ d: 'ok' }));

  readStream.on('error', function (err) {
    console.log({ err });
  });
};

initStream();
