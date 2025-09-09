# URAI Unit Test Examples

## Python (permissions_management_api.py)
```python
def test_grant_permission(client):
    resp = client.post('/api/permissions/grant', json={"userId": "testuser", "permission": "edit"})
    assert resp.status_code == 200
    assert resp.json["status"] == "success"

def test_revoke_permission(client):
    client.post('/api/permissions/grant', json={"userId": "testuser", "permission": "edit"})
    resp = client.post('/api/permissions/revoke', json={"userId": "testuser", "permission": "edit"})
    assert resp.status_code == 200
    assert resp.json["status"] == "success"
```

## JS (ForumThreadModerationUI.jsx)
```javascript
it('moderates selected threads', async () => {
  // mock axios, select threads, click button, assert status
});
```
