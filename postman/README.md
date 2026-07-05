# Microservice Decoupling Strategy Manager API - Postman

## Files

- `Microservice Decoupling Strategy Manager API.postman_collection.json`
- `Microservice Decoupling Strategy Manager API Local.postman_environment.json`

## How to Run

1. Start the backend API locally.
2. Import the collection JSON into Postman.
3. Import the local environment JSON into Postman.
4. Select the `Microservice Decoupling Strategy Manager API Local` environment.
5. Run requests in this order:
   - `Create Strategy`
   - `Get All Strategies`
   - `Get Strategy By ID`
   - `Update Strategy`
   - `Delete Strategy`

The `Create Strategy` request automatically saves the response `_id` into the `strategyId` environment variable. The get-by-id, update, and delete requests reuse that value through `{{strategyId}}`.

The collection includes tests for expected status codes, response time, JSON content type, and required response fields.
