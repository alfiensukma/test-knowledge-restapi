# test-knowledge-restapi

A simple REST API for user auth, wallet transfer, and etc (raw SQL + Node + TypeScript).

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL

## Setup
1. Install dependencies

```powershell
npm install
```

2. Create a `.env` file (copy from `.env.example` if available) and set required variables:

3. Run DB migrations (project includes a migrate script)

```powershell
npm run migrate
```

## Run
- Development (uses `ts-node` + `nodemon`):

```powershell
npm run dev
```

- Production (build then run):

```powershell
npm run build
npm start
```

## Useful scripts
- `npm run dev` — run in dev mode
- `npm run migrate` — run migrations

## API
- `POST /api/auth/register` — register a user (body: `username`, `email`, `password`)
- `POST /api/auth/login` — login (body: `identifier` (email or username), `password`)
- `POST /api/in` - stock in (body: `productId`, `qty`)
- `POST /api/rates` - external API connection (params: `from`, `to`)
- `POST /api/tasks` - take tasks (body: `title`, `scheduledAt`, `payload`, `email`, `discount`)
- `GET /api/wallet/balance` - view balance
- `GET /api/wallet/transactions` - view transactions
- `POST /api/wallet/topup` - top up saldo (body: `userId`, `amount`)
- `POST /api/wallet/transfer` - transfer saldo (body: `userId`, `toUsername`, `amount`)
- `GET /api/reports/stock-summary` - view report stock

## Notes
- Make sure `JWT_SECRET` is set in `.env` before starting the server.
- The project uses raw SQL queries in `src/repositories` and returns simple JSON responses.

## License
MIT