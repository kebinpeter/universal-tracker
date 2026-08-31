import React from 'react';

const nav = [
  ['Dashboard','▦'],['Gold Tracker','◉'],['Products','▣'],['Job Search','⌕'],['Medical Alerts','♡'],['Flight Scan','✈'],['Crypto','₿'],['Expenses','₹'],['Subscriptions','↻'],['Settings','⚙']
];

export default function App(){
  const [page,setPage]=React.useState('Dashboard');
  const [dark,setDark]=React.useState(false);
  const bg=dark?'#111827':'#f6f7fb';
  const card=dark?'#182033':'#fff';
  const border=dark?'#2d3748':'#e5e7ef';
  return <div className="app" style={{background:bg,color:dark?'#f8fafc':'#151827'}}>
    <aside className="sidebar">
      <div className="brand"><span className="brandMark">▦</span><div><strong>Universal Tracker</strong><small>Track life, stay ahead.</small></div></div>
      <div className="nav">{nav.map(([name,icon])=><button key={name} className={'navItem '+(page===name?'active':'')} onClick={()=>setPage(name)}><span>{icon}</span>{name}</button>)}</div>
      <div className="sidebarBottom"><button className="navItem" onClick={()=>setDark(!dark)}><span>{dark?'☀':'☾'}</span>{dark?'Light mode':'Dark mode'}</button></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><h1>{page}</h1><span>Overview</span></div><div className="topActions"><button aria-label="Search">⌕</button><button aria-label="Notifications">♢</button><div className="avatar">UT</div></div></header>
      <section className="content">{page==='Dashboard'?<Dashboard card={card} border={border}/>:<Feature page={page} card={card} border={border}/>}</section>
    </main>
  </div>
}

function Dashboard({card,border}){
 const stats=[['Gold Price','₹11,650','/g','↗ 2.4%'],['Products Tracked','0','',''],['Active Jobs','0','',''],['Medical Alerts','0','',''],['Flights Tracked','0','',''],['Expenses Today','₹0','',''],['This Month','₹0','',''],['Upcoming Bills','0','','']];
 return <>
  <div className="welcome"><div><p className="eyebrow">DASHBOARD OVERVIEW</p><h2>Good evening 👋</h2><p>Here’s what’s happening with your trackers today.</p></div><button className="primary">+ Add Tracker</button></div>
  <div className="stats">{stats.map(([label,value,suffix,change])=><div className="stat" style={{background:card,borderColor:border}} key={label}><span>{label}</span><strong>{value}<small>{suffix}</small></strong>{change&&<em>{change}</em>}</div>)}</div>
  <div className="grid2"><div className="panel" style={{background:card,borderColor:border}}><div className="panelHead"><h3>Recent Activity</h3><button>View all</button></div><div className="empty"><span>◌</span><strong>No recent activity</strong><p>Your tracker activity will appear here.</p></div></div><div className="panel" style={{background:card,borderColor:border}}><div className="panelHead"><h3>Notifications</h3><button>View all</button></div><div className="empty"><span>♢</span><strong>You're all caught up</strong><p>No new notifications.</p></div></div></div>
 </>
}
function Feature({page,card,border}){return <div className="feature"><p className="eyebrow">TRACKER</p><h2>{page}</h2><p className="muted">Manage and monitor your {page.toLowerCase()} here.</p><div className="panel" style={{background:card,borderColor:border}}><div className="empty"><span>◌</span><strong>No {page.toLowerCase()} data yet</strong><p>Add a tracker to start monitoring this section.</p><button className="primary">+ Add Tracker</button></div></div></div>}
