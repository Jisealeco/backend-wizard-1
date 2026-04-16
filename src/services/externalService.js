const axios = require("axios");

async function fetchAll(name) {
  const [genderRes, ageRes, countryRes] = await Promise.all([
    axios.get(`https://api.genderize.io?name=${name}`),
    axios.get(`https://api.agify.io?name=${name}`),
    axios.get(`https://api.nationalize.io?name=${name}`)
  ]);

  return {
    gender: genderRes.data,
    age: ageRes.data,
    country: countryRes.data
  };
}

module.exports = { fetchAll };