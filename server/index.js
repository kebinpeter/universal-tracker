import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const port = Number(process.env.PORT || 3000);
let db = null;
let mongoClient = null;
let mongoError = null;

async function connectDb() {
  if (!process.env.MONGODB_URI) {
    mongoError = 'MONGODB_URI is not configured';
    console.error(`MongoDB: ${mongoError}`);
    return;
  }

  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    await mongoClient.connect();
    await mongoClient.db(process.env.MONGODB_DB || 'universal_tracker').command({ ping: 1 });
    db = mongoClient.db(process.env.MONGODB_DB || 'universal_tracker');
    mongoError = null;
    console.log(`MongoDB connected: ${db.databaseName}`);
  } catch (error) {
    db = null;
    mongoError = error instanceof Error ? error.message : String(error);
    console.error(`MongoDB connection failed: ${mongoError}`);
  }
}

function initFirebase() {
  if (getApps().length) return;
  const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && key) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: key,
      }),
    });
  }
}

async function auth(req, res, next) {
  if (process.env.REQUIRE_AUTH !== 'true') {
    req.uid = 'demo-user';
    return next();
  }

  try {
    initFirebase();
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Firebase token' });
    }
    req.uid = (await getAuth().verifyIdToken(header.slice(7))).uid;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid Firebase token' });
  }
}

async function goldLive() {
  if (!process.env.GOLDAPI_KEY) throw new Error('GOLDAPI_KEY not configured');
  const response = await fetch('https://www.goldapi.io/api/XAU/INR', {
    headers: { 'x-access-token': process.env.GOLDAPI_KEY },
  });
  if (!response.ok) throw new Error('Gold API request failed');
  const data = await response.json();
  return {
    price: data.price,
    pricePerGram: data.price_per_gram ?? data.price / 31.1034768,
    changePercent: data.chp || 0,
    timestamp: data.timestamp,
  };
}

app.get('/api/health', async (_req, res) => {
  let ping = false;
  if (db) {
    try {
      await db.command({ ping: 1 });
      ping = true;
    } catch (error) {
      mongoError = error instanceof Error ? error.message : String(error);
    }
  }

  res.status(ping ? 200 : 503).json({
    ok: ping,
    database: 'mongodb',
    mongoConnected: ping,
    databaseName: process.env.MONGODB_DB || 'universal_tracker',
    error: ping ? null : mongoError,
  });
});

app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const gold = await goldLive().catch(() => null);
    const counts = db
      ? await Promise.all([
          db.collection('trackers').countDocuments({ uid: req.uid, type: 'product' }),
          db.collection('trackers').countDocuments({ uid: req.uid, type: 'job' }),
          db.collection('medicalAlerts').countDocuments({ uid: req.uid }),
          db.collection('trackers').countDocuments({ uid: req.uid, type: 'flight' }),
        ])
      : [0, 0, 0, 0];
    res.json({ gold, products: counts[0], jobs: counts[1], medical: counts[2], flights: counts[3] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gold/live', auth, async (_req, res) => {
  try {
    res.json(await goldLive());
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.get('/api/products/search', auth, async (req, res) => {
  try {
    if (!process.env.SERPAPI_KEY) throw new Error('SERPAPI_KEY not configured');
    const url = new URL('https://serpapi.com/search');
    url.searchParams.set('engine', 'google_shopping');
    url.searchParams.set('q', req.query.q || '');
    url.searchParams.set('gl', 'in');
    url.searchParams.set('hl', 'en');
    url.searchParams.set('api_key', process.env.SERPAPI_KEY);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Product API request failed');
    const data = await response.json();
    res.json({
      results: (data.shopping_results || []).map((product) => ({
        title: product.title,
        price: product.price,
        source: product.source,
        thumbnail: product.thumbnail,
        url: product.product_link,
      })),
    });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.get('/api/jobs/search', auth, async (req, res) => {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      throw new Error('ADZUNA credentials not configured');
    }
    const url = new URL('https://api.adzuna.com/v1/api/jobs/in/search/1');
    url.searchParams.set('app_id', process.env.ADZUNA_APP_ID);
    url.searchParams.set('app_key', process.env.ADZUNA_APP_KEY);
    url.searchParams.set('results_per_page', '20');
    url.searchParams.set('what', req.query.what || '');
    if (req.query.location) url.searchParams.set('where', req.query.location);
    url.searchParams.set('content-type', 'application/json');
    const response = await fetch(url);
    if (!response.ok) throw new Error('Jobs API request failed');
    const data = await response.json();
    res.json({
      results: (data.results || []).map((job) => ({
        title: job.title,
        company: job.company?.display_name || '',
        location: job.location?.display_name || '',
        url: job.redirect_url,
      })),
    });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.get('/api/medical/alerts', auth, async (req, res) => {
  try {
    const url = new URL('https://api.fda.gov/drug/enforcement.json');
    if (req.query.q) url.searchParams.set('search', `product_description:${req.query.q}`);
    url.searchParams.set('limit', '20');
    const response = await fetch(url);
    if (response.status === 404) return res.json({ results: [] });
    if (!response.ok) throw new Error('Medical API request failed');
    const data = await response.json();
    res.json({
      results: (data.results || []).map((alert) => ({
        product: alert.product_description || '',
        reason: alert.reason_for_recall || '',
        status: alert.status || '',
        date: alert.recall_initiation_date || '',
      })),
    });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

async function amadeusToken() {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    throw new Error('Amadeus credentials not configured');
  }
  const base = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
  const response = await fetch(`${base}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
  });
  if (!response.ok) throw new Error('Amadeus authentication failed');
  return (await response.json()).access_token;
}

app.get('/api/flights/search', auth, async (req, res) => {
  try {
    const base = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
    const token = await amadeusToken();
    const url = new URL(`${base}/v2/shopping/flight-offers`);
    url.searchParams.set('originLocationCode', req.query.origin || 'COK');
    url.searchParams.set('destinationLocationCode', req.query.destination || 'DEL');
    url.searchParams.set('departureDate', req.query.date);
    url.searchParams.set('adults', req.query.adults || '1');
    url.searchParams.set('currencyCode', 'INR');
    url.searchParams.set('max', '20');
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error('Flight API request failed');
    const data = await response.json();
    res.json({
      results: (data.data || []).map((flight) => ({
        price: flight.price?.grandTotal,
        currency: flight.price?.currency,
        airline: flight.validatingAirlineCodes?.[0] || '',
        departure: flight.itineraries?.[0]?.segments?.[0]?.departure?.at,
        arrival: flight.itineraries?.[0]?.segments?.at(-1)?.arrival?.at,
        stops: (flight.itineraries?.[0]?.segments?.length || 1) - 1,
      })),
    });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.get('/api/trackers', auth, async (req, res) => {
  if (!db) return res.status(503).json({ error: 'MongoDB not connected' });
  res.json({
    results: await db.collection('trackers').find({ uid: req.uid }).sort({ createdAt: -1 }).toArray(),
  });
});

app.post('/api/trackers', auth, async (req, res) => {
  if (!db) return res.status(503).json({ error: 'MongoDB not connected' });
  const result = await db.collection('trackers').insertOne({
    ...req.body,
    uid: req.uid,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.json({ id: result.insertedId.toString() });
});

app.delete('/api/trackers/:id', auth, async (req, res) => {
  if (!db) return res.status(503).json({ error: 'MongoDB not connected' });
  await db.collection('trackers').deleteOne({ _id: new ObjectId(req.params.id), uid: req.uid });
  res.json({ ok: true });
});

const server = app.listen(port, async () => {
  await connectDb();
  console.log(`Universal Tracker API listening on ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal}: shutting down`);
  server.close(async () => {
    if (mongoClient) await mongoClient.close().catch(() => {});
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
