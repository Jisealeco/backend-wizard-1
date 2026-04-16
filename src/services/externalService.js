const axios = require("axios");

async function fetchAll(name) {
  try {
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

  } catch (error) {
    throw new Error("EXTERNAL_API_ERROR");
  }
}

module.exports = { fetchAll };