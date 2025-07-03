# Financialist Backend

The backend of the Financialist app is an Express.js server providing authentication and profile endpoints for the Next.js frontend. It uses JWT for authentication, `httpOnly` cookies for secure token storage, and environment variables for configuration.

## Features

- **Authentication Endpoint (`/auth`)**:

  - Accepts POST requests with `username` and `password`.
  - Generates a JWT with `user_type` (`type_1` for `username: type1user`, `type_2` otherwise) signed with `JWT_SECRET`.
  - Sets an `httpOnly` cookie (`token`) with `sameSite: lax` and `secure: true` in production.
  - Returns the token and `user_type` in the response.
  - **Screenshot**: [Insert screenshot of DevTools > Network showing `/auth` response with `Set-Cookie: token=...`.]

- **Profile Endpoint (`/profile`)**:

  - Accepts GET requests with the `token` cookie or `Authorization: Bearer <token>` header.
  - Verifies the JWT using `JWT_SECRET` and returns the `user_type`.
  - Returns 401 for invalid or missing tokens.
  - **Screenshot**: [Insert screenshot of DevTools > Network showing `/profile` response with `user_type`.]

- **Environment Variables**:

  - Configured in `.env` for `API_BASE_URL` (e.g., `http://localhost:3001`) and `JWT_SECRET`.
  - Ensures secure, configurable deployment without hardcoded secrets.

- **CORS**:

  - Configured to allow requests from the frontend (e.g., `http://localhost:3000` locally, Render URL in production) with `credentials: true` for cookies.

- **Logging**:
  - Logs request headers, cookies, and JWT decoding for debugging.

## Project Structure

```
backend/
├── .env            # Environment variables (not committed)
├── .gitignore      # Ignores node_modules, .env
├── server.js       # Express server with /auth and /profile endpoints
├── package.json    # Dependencies and scripts
```

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/financialist-backend.git
   cd financialist-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   - Create a `.env` file in `backend/`:
     ```env
     API_BASE_URL=http://localhost:3001
     JWT_SECRET=4270fd848daceb84e33733b14b25f489b1ad964cb76745f3e433c429555ad50f
     FRONTEND_API_BASE_URL=http://localhost:3000
     ```

4. **Run Locally**:

   ```bash
   node server.js

   ```

   - Server runs at `http://localhost:3001`.

## Testing

1. **Test Locally**:

   - Use Postman or `curl` to test `/auth`:
     ```bash
     curl -X POST http://localhost:3001/auth -H "Content-Type: application/json" -d '{"username":"type1user","password":"any"}'
     ```
     - Verify `Set-Cookie: token=...` and `user_type: type_1` in the response.
   - Test `/profile` with the token:
     ```bash
     curl http://localhost:3001/profile -H "Cookie: token=<token>"
     ```
     - Verify `user_type: type_1`.

2. **Test Deployed**:

   - Use the frontend’s deployed URL to log in and check `/auth` and `/profile` requests in DevTools > Network.
   - Verify Render logs for `Request Headers:`, `COOKIES:`, and `DECODED:`.
