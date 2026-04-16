# Backend Wizards — Stage 1 API

## Description

This API accepts a name, calls the Genderize, Agify, and Nationalize APIs, processes the data, stores it, and exposes endpoints to manage profiles.

---

## Base URL


---

## Endpoints

### Create Profile

POST /api/profiles

Request Body:

```json
{
  "name": "ella"
}
```

Success Response (201):

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 46,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.85,
    "created_at": "ISO_DATE"
  }
}
```

Duplicate Response (200):

```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { }
}
```

---

### Get Single Profile

GET /api/profiles/{id}

Success Response (200):

```json
{
  "status": "success",
  "data": { }
}
```

---

### Get All Profiles

GET /api/profiles

Query Parameters (optional):

* gender
* country_id
* age_group

Example:
GET /api/profiles?gender=male&country_id=NG

Success Response (200):

```json
{
  "status": "success",
  "count": 1,
  "data": [
    {
      "id": "id",
      "name": "ella",
      "gender": "female",
      "age": 46,
      "age_group": "adult",
      "country_id": "NG"
    }
  ]
}
```

---

### Delete Profile

DELETE /api/profiles/{id}

Success Response:
204 No Content

---

## Error Responses

Format:

```json
{
  "status": "error",
  "message": "<error message>"
}
```

Possible Errors:

* 400 Bad Request: Missing or empty name
* 422 Unprocessable Entity: Invalid type
* 404 Not Found: Profile not found
* 502 Bad Gateway: External API returned an invalid response
* 502 Bad Gateway: Upstream or server failure

---

## Notes

* All timestamps are in UTC ISO 8601 format
* IDs are generated using UUID v7
* Query parameters are case-insensitive
