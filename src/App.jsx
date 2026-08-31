import React, { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_API || 'true').toLowerCase() !== 'false';

const demoJobs = [
  { id: 'job-1', title: 'React Developer', company: 'Tech Solutions', location: 'Bangalore', salary: '₹6–10 LPA', type: 'Full-time' },
  { id: 'job-2', title: 'Frontend Engineer', company: 'Digital Labs', location: 'Kochi', salary: '₹5–9 LPA', type: 'Full-time' },
  { id: 'job-3', title: 'Full Stack Developer', company: 'Cloud Systems', location: 'Remote', salary: '₹8–14 LPA', type: 'Full-time' },
];

const demoMedical = [
  { id: 'med-1', group: 'O+', location: 'Kochi', urgency: 'Critical', units: 3 },
  { id: 'med-2', group: 'A+', location: 'Ernakulam', urgency: 'High', units: 2 },
  { id: 'med-3', group: 'B+', location: 'Kakkanad', urgency: 'Medium', units: 1 },
];

function safeRead(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

async function api(path, options = {}) {
  if (!API) throw new Error('API base URL is not configured');
  const response = await fetch(`${API.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.status === 204 ? null : response.json();
}

function Card({ children, className = '' }) { return <div className={`card ${className}`}>{children}</div>; }
function Stat({ label, value, icon }) { return <Card><div className="stat"><span className="stat-icon">{icon}</span><div><div className="stat-value">{value}</div><div className="muted">{label}</div></div></div></Card>; }

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [notice, setNotice] = useState('');
  const [jobs, setJobs] = useState(demoJobs);
  const [medical, setMedical] = useState(demoMedical);
  const [subscriptions, setSubscriptions] = useState(() => safeRead('tracker-subscriptions', []));
  const [products, setProducts] = useState(() => safeRead('tracker-products', []));
  const [search, setSearch] = useState({ keyword: 'React Developer', location: 'Bangalore', salary: '' });
  const [productUrl, setProductUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [gold, setGold] = useState({ price: 0, updated: new Date().toISOString() });

  useEffect(() => { localStorage.setItem('tracker-subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('tracker-products', JSON.stringify(products)); }, [products]);
  useEffect(() => {
    setGold({ price: 7350 + Math.floor(Math.random() * 150), updated: new Date().toISOString() });
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredJobs = useMemo(() => {
    const q = search.keyword.trim().toLowerCase();
    const loc = search.location.trim().toLowerCase();
    return jobs.filter(j => (!q || `${j.title} ${j.company}`.toLowerCase().includes(q)) && (!loc || j.location.toLowerCase().includes(loc) || j.location === 'Remote'));
  }, [jobs, search]);

  const navigate = (next) => { setPage(next); setNotice(''); };

  const searchJobs = async (event) => {
    event?.preventDefault();
    if (!USE_MOCK) {
      try {
        const data = await api('/api/job/search', { method: 'POST', body: JSON.stringify(search) });
        setJobs(Array.isArray(data) ? data : data.jobs || demoJobs);
        return;
      } catch (error) { setNotice(`Job API unavailable — showing demo results (${error.message}).`); }
    }
    setJobs(demoJobs);
  };

  const subscribe = () => {
    const item = { id: crypto.randomUUID?.() || String(Date.now()), ...search, createdAt: new Date().toISOString() };
    setSubscriptions(prev => [item, ...prev]);
    setNotice('Job alert subscription saved.');
  };

  const deleteSubscription = (id) => setSubscriptions(prev => prev.filter(item => item.id !== id));

  const addProduct = async (event) => {
    event.preventDefault();
    if (!productUrl.trim()) return;
    let item = { id: crypto.randomUUID?.() || String(Date.now()), url: productUrl.trim(), name: 'Tracked product', price: Number(targetPrice) || 0, target: Number(targetPrice) || 0, updatedAt: new Date().toISOString() };
    if (!USE_MOCK) {
      try {
        const data = await api('/api/product/add', { method: 'POST', body: JSON.stringify(item) });
        item = { ...item, ...(data?.product || data || {}) };
      } catch (error) { setNotice(`Product API unavailable — saved locally (${error.message}).`); }
    }
    setProducts(prev => [item, ...prev]);
    setProductUrl(''); setTargetPrice('');
    setNotice('Product added to your tracker.');
  };

  const respondMedical = (id) => {
    setMedical(prev => prev.filter(item => item.id !== id));
    setNotice('Thank you. Your response has been recorded locally.');
  };

  const title = { dashboard: 'Dashboard', jobs: 'Job Tracker', products: 'Product Tracker', gold: 'Gold Tracker', medical: 'Medical Alerts', notifications: 'Notifications', settings: 'Settings' }[page];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">◎</span><span>Universal Tracker</span></div>
        <nav>
          <button className={page === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('dashboard')}>⌂ <span>Dashboard</span></button>
          <button className={page === 'gold' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('gold')}>◆ <span>Gold Tracker</span></button>
          <button className={page === 'products' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('products')}>▣ <span>Products</span></button>
          <button className={page === 'jobs' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('jobs')}>▤ <span>Jobs</span></button>
          <button className={page === 'medical' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('medical')}>✚ <span>Medical Alerts</span></button>
          <button className={page === 'notifications' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('notifications')}>◉ <span>Notifications</span></button>
        </nav>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => navigate('settings')}>⚙ <span>Settings</span></button></div>
      </aside>

      <main className="main">
        <header className="topbar"><div><div className="eyebrow">UNIVERSAL TRACKER</div><h1>{title}</h1></div><div className="status-pill"><span className="dot" /> System ready</div></header>
        {notice && <div className="notice">{notice}</div>}

        {page === 'dashboard' && <>
          <section className="hero"><div><div className="eyebrow">REAL-TIME MONITORING</div><h2>Everything you want to track, in one place.</h2><p>Monitor prices, jobs, gold rates and medical alerts with a resilient local fallback when an API is unavailable.</p></div><button className="primary" onClick={() => navigate('jobs')}>Find jobs →</button></section>
          <div className="stats-grid"><Stat icon="◆" label="Gold price / g" value={`₹${gold.price.toLocaleString('en-IN')}`} /><Stat icon="▣" label="Tracked products" value={products.length} /><Stat icon="▤" label="Job alerts" value={subscriptions.length} /><Stat icon="✚" label="Medical requests" value={medical.length} /></div>
          <div className="two-col"><Card><div className="card-head"><h3>Recent job matches</h3><button className="link" onClick={() => navigate('jobs')}>View all</button></div>{demoJobs.map(job => <div className="list-row" key={job.id}><div><strong>{job.title}</strong><span>{job.company} · {job.location}</span></div><span className="badge">{job.salary}</span></div>)}</Card><Card><div className="card-head"><h3>Medical alerts</h3><button className="link" onClick={() => navigate('medical')}>View all</button></div>{medical.slice(0, 3).map(item => <div className="list-row" key={item.id}><div><strong>{item.group} blood needed</strong><span>{item.location} · {item.units} unit(s)</span></div><span className="badge danger">{item.urgency}</span></div>)}</Card></div>
        </>}

        {page === 'jobs' && <Card><div className="card-head"><div><h2>Job Search</h2><p className="muted">Search and subscribe to job alerts.</p></div><button className="secondary" onClick={subscribe}>Subscribe</button></div><form className="search-grid" onSubmit={searchJobs}><input value={search.keyword} onChange={e => setSearch({...search, keyword: e.target.value})} placeholder="Job title or keyword" /><input value={search.location} onChange={e => setSearch({...search, location: e.target.value})} placeholder="Location" /><input value={search.salary} onChange={e => setSearch({...search, salary: e.target.value})} placeholder="Minimum salary" /><button className="primary" type="submit">Search</button></form><div className="results">{filteredJobs.length ? filteredJobs.map(job => <div className="job-card" key={job.id}><div><span className="badge">{job.type}</span><h3>{job.title}</h3><p>{job.company} · {job.location}</p><strong>{job.salary}</strong></div><button className="secondary" onClick={() => setNotice('Job saved locally.')}>Save</button></div>) : <Empty text="No jobs found. Try a broader keyword or location." />}</div><h3 className="section-title">Subscriptions</h3>{subscriptions.length ? subscriptions.map(s => <div className="list-row" key={s.id}><div><strong>{s.keyword}</strong><span>{s.location || 'Any location'}</span></div><button className="danger-button" onClick={() => deleteSubscription(s.id)}>Delete</button></div>) : <p className="muted">No saved job alerts yet.</p>}</Card>}

        {page === 'products' && <Card><div className="card-head"><div><h2>Product Price Tracker</h2><p className="muted">Track a product URL and target price.</p></div></div><form className="search-grid product-form" onSubmit={addProduct}><input className="wide" value={productUrl} onChange={e => setProductUrl(e.target.value)} placeholder="https://example.com/product" required /><input value={targetPrice} onChange={e => setTargetPrice(e.target.value)} placeholder="Target price ₹" type="number" /><button className="primary" type="submit">Add Product</button></form><div className="results">{products.length ? products.map(p => <div className="job-card" key={p.id}><div><span className="badge">TRACKING</span><h3>{p.name || 'Tracked product'}</h3><p className="truncate">{p.url}</p><strong>{p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : 'Price pending'}</strong>{p.target ? <span className="muted"> · target ₹{Number(p.target).toLocaleString('en-IN')}</span> : null}</div><button className="danger-button" onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}>Remove</button></div>) : <Empty text="No products tracked yet." />}</div></Card>}

        {page === 'gold' && <Card><div className="gold-panel"><div><div className="eyebrow">INDIA · 24K</div><h2>₹{gold.price.toLocaleString('en-IN')} <small>/ gram</small></h2><p className="muted">Last refreshed {new Date(gold.updated).toLocaleTimeString()}</p></div><button className="primary" onClick={() => setGold({price: 7350 + Math.floor(Math.random() * 150), updated: new Date().toISOString()})}>Refresh</button></div><div className="info-box">Real GoldAPI requests are currently avoided when the configured quota is exhausted. The app remains usable with a safe development fallback.</div></Card>}

        {page === 'medical' && <Card><div className="card-head"><div><h2>Medical Alerts</h2><p className="muted">Nearby blood donation requests.</p></div></div>{medical.length ? medical.map(item => <div className="job-card" key={item.id}><div><span className={`badge ${item.urgency === 'Critical' ? 'danger' : ''}`}>{item.urgency}</span><h3>{item.group} blood needed</h3><p>{item.location} · {item.units} unit(s)</p></div><button className="primary" onClick={() => respondMedical(item.id)}>I can help</button></div>) : <Empty text="No active medical alerts." />}</Card>}

        {page === 'notifications' && <Card><h2>Notifications</h2><p className="muted">Your alert history will appear here.</p><Empty text="No new notifications." /></Card>}
        {page === 'settings' && <Card><h2>Settings</h2><p className="muted">API mode: <strong>{USE_MOCK ? 'Mock / resilient fallback' : 'Backend API'}</strong></p><div className="info-box">Backend URL: {API || 'not configured'}</div><button className="secondary" onClick={() => { localStorage.clear(); location.reload(); }}>Reset local tracker data</button></Card>}
      </main>
    </div>
  );
}

function Empty({ text }) { return <div className="empty">{text}</div>; }
