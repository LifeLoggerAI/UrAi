# URAI Scenario Walkthrough Documentation

## Scenario: Admin grants permission and sets rate limit

1. Admin logs in through Authentication UI (`AuthenticationUI.jsx`).
2. Admin navigates to Permissions Management UI and grants "moderate" permission to user.
3. Admin navigates to Rate Limiting UI and sets a limit for the same user.
4. User tries to perform moderation actions – allowed if within rate limit.
5. If rate limit exceeded, user receives error response (status 429).

## Related Files:
- PermissionsManagementUI.jsx
- RateLimitingUI.jsx
- authentication_api.py
- permissions_management_api.py
- ratelimit_api.py
