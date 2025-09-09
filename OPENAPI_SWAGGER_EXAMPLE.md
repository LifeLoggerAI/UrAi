# URAI OpenAPI/Swagger Example

```yaml
openapi: 3.0.0
info:
  title: URAI Admin API
  version: 1.0.0
paths:
  /api/auth/login:
    post:
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Success
        '401':
          description: Unauthorized
  /api/permissions/grant:
    post:
      summary: Grant a permission
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                permission:
                  type: string
      responses:
        '200':
          description: Success
        '400':
          description: Bad Request
```
