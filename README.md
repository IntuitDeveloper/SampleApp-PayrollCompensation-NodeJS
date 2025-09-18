## QuickBooks Employee Compensation Sample (Node.js)

A minimal Node.js app demonstrating QuickBooks Online OAuth, basic QBO REST queries, and a GraphQL call to retrieve employee compensation, with a small UI to drive the flow.

### Prerequisites
- **Node.js 18+** (required - older versions will fail with `Cannot find module 'node:events'`)
- A QuickBooks Online sandbox company
- An Intuit Developer app (Client ID/Secret, Redirect URI)

**Check your Node version:**
```bash
node --version
# Should show v18.0.0 or higher
```

### Environment Variables
Create an `.env` file in the project root:

```
PORT=3000
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ENVIRONMENT=sandbox
REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### Install and Run
```bash
# Install all dependencies (including peer dependencies)
npm install

# If you get "Cannot find package 'graphql'" error, install it explicitly:
npm install graphql

# Start the server
npm start
```
The app starts at `http://localhost:3000`.

### OAuth Flow
1) Open the app and click “Connect to QuickBooks” (or GET `/api/auth/login`).
2) Complete sign‑in and consent in Intuit’s flow.
3) You’ll be redirected back; the app stores the OAuth client in memory for API calls.

### REST Endpoints
- `GET /api/quickbook/employee` → First 10 Employees (QBO Query API)
- `GET /api/quickbook/employee/customers` → First 10 Customers
- `GET /api/quickbook/employee/items` → First 10 Items
- `POST /api/quickbook/employee/time-activity` → Create a TimeActivity

All REST calls include:
- Base URL: `https://sandbox-quickbooks.api.intuit.com` (sandbox) or `https://quickbooks.api.intuit.com` (prod)
- Headers: `Authorization: Bearer <access_token>`, `Accept: application/json`, `Content-Type: application/json`

Example (Items):
```
curl -X GET \
  "https://quickbooks.api.intuit.com/v3/company/<realmId>/query?query=SELECT%20*%20FROM%20Item%20maxresults%2010" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Accept: application/json"
```

### GraphQL Endpoint (Employee Compensation)
- `GET /api/quickbook/employee/compensation/:id`

The server constructs a GraphQL client with:
- Endpoint: `https://qb-sandbox.api.intuit.com/graphql` (sandbox) or `https://qb.api.intuit.com/graphql` (prod)
- Headers: `Authorization: Bearer <access_token>`, `intuit-realm-id: <realmId>`

Variables sent include employee id and optional flags (e.g., `active`, `first`). Ensure your app and company have payroll GraphQL access.

### Frontend
- Served at `/` with a simple UI to:
  - Connect to QuickBooks
  - Load Employees, Customers, Items
  - Fetch employee compensation and create a TimeActivity

### Troubleshooting

#### Installation Issues
- **Node version too old**: Update to Node.js 18+ if you see `Cannot find module 'node:events'`
- **Missing graphql package**: Run `npm install graphql` if you see `Cannot find package 'graphql'`
- **Clean install**: If issues persist, try:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

#### Runtime Issues
- **401 Not authenticated**: Complete OAuth again (`/api/auth/login`)
- **400 GraphQL validation**: Ensure payroll GraphQL access and variable shapes match your tenant's schema
- **Missing data**: Verify `realmId` is present on the token and the company has sample data

### Scripts
- `npm start` → Start server on `PORT` (default 3000)

### License
For demo purposes only.


