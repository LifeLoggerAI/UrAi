# URAI Documentation Example – API Error Handling

## Overview
All API endpoints return clear error messages and status codes.

## Usage
- Check the response `status` field and HTTP status code.
- Handle 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 429 (rate limit), and 500 (server error).

## Example Error Response
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

## Troubleshooting
- Log error messages and review API documentation for proper request format.

## Contributors
- @user2