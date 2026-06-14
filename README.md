# Stock Broker Client Web Dashboard

This project is a web dashboard that allows users to log in, subscribe to a list of predefined stocks, and view live price updates. It was built to satisfy the requirements of the stock broker assignment.

## Assignment Requirements Covered

- Allows a user to login using their email
- Subscribe to a supported stock via ticker code
- Supports 5 specific stocks: GOOG, TSLA, AMZN, META, NVDA
- Update stock prices of subscribed stocks without refreshing the dashboard
- Supports at least two users subscribing to different stocks and updating asynchronously
- Uses a random number generator to simulate stock prices every second

## Features

- Email and password login
- View a list of 5 supported stocks and click to subscribe or unsubscribe
- Dashboard displaying only the stocks the user is currently subscribed to
- Realtime price updates every second using WebSockets
- User-specific data isolation (each user only receives updates for their own subscriptions)

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Fastify, Socket.IO, Prisma
- **Database:** SQLite

## How It Works

1. **Login:** The user logs in via a simple REST API and receives an authentication token in a cookie.
2. **Subscribe:** The user selects which stocks they want to track from the list of 5 supported tickers. This preference is saved in the database.
3. **WebSockets:** Once logged in, the dashboard opens a Socket.IO connection to the backend.
4. **Price Updates:** A background loop on the server generates random prices every second. It checks which users are subscribed to which stocks, and pushes the new prices directly to those specific users over the active socket connection.

## Architecture

```text
[Browser 1] <--- WebSocket (prices) ---> [Fastify Server] <---> [SQLite DB]
[Browser 2] <--- WebSocket (prices) --->        |
                                         [Price Simulator]
```

## Folder Structure

```text
├── backend/
│   ├── prisma/      # SQLite database and schema
│   └── src/         # API routes, websockets, and price simulator
└── frontend/
    ├── app/         # Next.js pages (login, dashboard)
    └── components/  # React components for the UI
```

## Setup

You will need Node.js installed.

1. Clone the repository.
2. Install dependencies for both parts:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

**Backend (`backend/.env`)**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret"
FRONTEND_URL="http://localhost:3000"
BACKEND_PORT="4000"
```

**Frontend (`frontend/.env`)**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Running Locally

**Backend**
```bash
cd backend
npm run db:reset
npm run dev
```

**Frontend**
```bash
cd frontend
npm run dev
```
The application will be running at `http://localhost:3000`.

## Testing

To verify the multi-user and realtime requirements:

1. Open `http://localhost:3000` in a normal browser window and log in.
2. Open a second session in an incognito/private window and log in with a different test user account.
3. In the first window, subscribe to GOOG and TSLA.
4. In the second window, subscribe to AMZN and META.
5. Verify that each dashboard updates its prices every second without refreshing the page.
6. Verify that the first window only receives prices for GOOG and TSLA, while the second window receives prices independently for AMZN and META.

## Security Notes

- Passwords are hashed in the database using bcrypt.
- Sessions are managed with JWTs stored in HttpOnly cookies to prevent client-side script access.
- Incoming API requests are checked with strict input validation using Zod.

## Screenshots

[Screenshot 1 Placeholder: Login Screen]
[Screenshot 2 Placeholder: Subscribed Stocks Dashboard]

## Notes

The prices shown on the dashboard are simulated using a random number generator on the server and do not reflect real market data.
