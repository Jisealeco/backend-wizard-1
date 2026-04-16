const express = require("express");
const { fetchAll } = require("../services/externalService");
const profiles = require("../db/db");
const { getAgeGroup, getTopCountry } = require("../utils/helpers");
const { v7: uuidv7 } = require("uuid");

const router = express.Router();


// CREATE PROFILE
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name"
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Invalid type"
      });
    }

    const existing = profiles.find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: existing
      });
    }

    const { gender, age, country } = await fetchAll(name);

    if (!gender.gender || gender.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Genderize returned an invalid response"
      });
    }

    if (age.age === null) {
      return res.status(502).json({
        status: "error",
        message: "Agify returned an invalid response"
      });
    }

    if (!country.country || country.country.length === 0) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize returned an invalid response"
      });
    }

    const topCountry = getTopCountry(country.country);

    const profile = {
      id: uuidv7(),
      name: name,
      gender: gender.gender,
      gender_probability: gender.probability,
      sample_size: gender.count,
      age: age.age,
      age_group: getAgeGroup(age.age),
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date().toISOString()
    };

    profiles.push(profile);

    return res.status(201).json({
      status: "success",
      data: profile
    });

  } catch (error) {
    return res.status(502).json({
      status: "error",
      message: "Upstream or server failure"
    });
  }
});


// GET SINGLE
router.get("/:id", (req, res) => {
  const profile = profiles.find(p => p.id === req.params.id);

  if (!profile) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  return res.status(200).json({
    status: "success",
    data: profile
  });
});


// GET ALL (WITH FILTER)
router.get("/", (req, res) => {
  let result = profiles;

  const { gender, country_id, age_group } = req.query;

  if (gender) {
    result = result.filter(
      p => p.gender.toLowerCase() === gender.toLowerCase()
    );
  }

  if (country_id) {
    result = result.filter(
      p => p.country_id.toLowerCase() === country_id.toLowerCase()
    );
  }

  if (age_group) {
    result = result.filter(
      p => p.age_group.toLowerCase() === age_group.toLowerCase()
    );
  }

  return res.status(200).json({
    status: "success",
    count: result.length,
    data: result.map(p => ({
      id: p.id,
      name: p.name,
      gender: p.gender,
      age: p.age,
      age_group: p.age_group,
      country_id: p.country_id
    }))
  });
});


// DELETE
router.delete("/:id", (req, res) => {
  const index = profiles.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  profiles.splice(index, 1);

  return res.status(204).send();
});

module.exports = router;