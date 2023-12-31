const fs = require('fs');
const converter = require('openapi-to-postmanv2');
const axios = require('axios');
const core= require('@actions/core');

const getSpecFromUrl = async (url) => {
  const data = await axios.get(url);
  return data.data;
}

const getSpecFromFile = (path) => {
  return fs.readFileSync(path, {encoding: 'UTF8'});
}

const convertToPostman = async (openapiData, options) => {

  return new Promise((resolve, reject) => {
    converter.convert({ type: 'string', data: openapiData },
      { options }, (err, conversionResult) => {
        if(err || 
          !conversionResult.result || 
          !conversionResult.output || 
          conversionResult.output.length === 0 ||
          !conversionResult.output[0].data) {
              if(conversionResult.reason) {
                return reject('Could not convert', conversionResult.reason);
              }
              return reject('Something went wrong');
            } else {
              const collection = {collection: conversionResult.output[0].data};
              return resolve(collection);
            }
      });
  });
}

const publish = async (postmanCollectionUid, postmanCollection, postmanApiKey) => {
  return await axios.put(`https://api.getpostman.com/collections/${postmanCollectionUid}?apikey=${postmanApiKey}`, postmanCollection);
}

const update = async () => {

  try {
    const postmanApiKey = core.getInput('postmanApiKey');
    const postmanCollectionUid = core.getInput('postmanCollectionUid');
    const openApiSpec = core.getInput('openApiSpec');
    const options = core.getMultilineInput('options').join(',');

    const isUrl = (openApiSpec.startsWith("https") || openApiSpec.startsWith("http"));
    const openapiData = isUrl ? await getSpecFromUrl(openApiSpec) : getSpecFromFile(openApiSpec);
    const postmanCollection = await convertToPostman(openapiData, options);

    await publish(postmanCollectionUid, postmanCollection, postmanApiKey);
  } catch (e) {
    console.log(e)
    core.setFailed(e.message);
  }
}

update();

