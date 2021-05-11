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
  let readStream = fs.createReadStream(filename);

  readStream.on('data', async (chunk) => {
    const arr = chunk.toString('utf-8').split('\n');
    await DomainSchema.bulkCreate(await validJSON(arr));
  });

  readStream.on('error', function (err) {
    console.log({ err });
  });
};

initStream();
