# Tool Lending Library API - Postman

## Files

- `Tool Lending Library API.postman_collection.json`
- `Tool Lending Library API Local.postman_environment.json`

## How to Run

1. Start the backend API locally.
2. Import the collection JSON into Postman.
3. Import the local environment JSON into Postman.
4. Select the `Tool Lending Library API Local` environment.
5. Run requests in this order:
   - `Create Tool`
   - `Get All Tools`
   - `Get Tool By ID`
   - `Update Tool`
   - `Delete Tool`

The `Create Tool` request automatically saves the response `_id` into the `toolId` environment variable. The get-by-id, update, and delete requests reuse that value through `{{toolId}}`.

The collection includes tests for expected status codes, response time, JSON content type, and required response fields.
