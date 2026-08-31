# Universal Tracker

React/Vite UI matching the project recording, with a Node/Express API layer.

## Connected providers
- Firebase Authentication: Email/Password and Google. UI login stays hidden until `VITE_AUTH_ENABLED=true`.
- MongoDB Atlas: tracker persistence and per-user data.
- GoldAPI.io: XAU/INR live gold pricing.
- SerpApi Google Shopping: product search and price discovery.
- Adzuna: India job search.
- openFDA: public drug recall/safety data.
- Amadeus Self-Service: flight offer search.

## Run locally
1. Copy `.env.example` to `.env` and fill the provider credentials.
2. Run `npm install`.
3. Run `npm run server`.
4. In another terminal run `npm run dev`.

Never put private provider API keys in the browser. Firebase web config is safe for the client; Firebase Admin service-account credentials, MongoDB URI, GoldAPI, SerpApi, Adzuna and Amadeus secrets belong on the server.

Flight search is supported. Actual ticket issuance is a separate production/airline-consolidator requirement.