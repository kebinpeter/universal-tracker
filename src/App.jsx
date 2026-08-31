import React from 'react';

const nav = ['Dashboard','Gold Tracker','Products','Job Search','Medical Alerts','Flight Scan','Crypto','Expenses','Subscriptions','Settings'];

export default function App(){
  const [page,setPage]=React.useState('Dashboard');
  const [dark,setDark]=React.useState(false);
  const bg=dark?'#111827':'#f7f8fc';
  return <div style={{minHeight:'100vh',background:bg,color:dark?'#fff':'#111827',fontFamily:'Inter,Arial,sans-serif',display:'flex'}}><aside style={{width:220,background:dark?'#171e2e':'#15112b',color:'#fff',padding:18,boxSizing:'border-box'}}><div style={{fontWeight:700,fontSize:17,marginBottom:28}}>▦ Universal Tracker</div>{nav.map(x=><div key={x} onClick={()=>setPage(x)} style={{padding:'10px 12px',borderRadius:7,margin:'3px 0',cursor:'pointer',background:page===x?'#6638ed':'transparent',fontSize:13}}>{x}</div>)}</aside><main style={{flex:1}}><header style={{height:54,borderBottom:'1px solid #ddd',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',background:dark?'#111827':'#fff'}}><b style={{fontSize:13}}>{page}</b><div>⌕　🔔　<span style={{fontSize:12}}>Welcome</span></div></header><section style={{padding:28,maxWidth:1100}}><h1 style={{fontSize:20,margin:'0 0 6px'}}>{page} <small style={{fontSize:11,color:'#888'}}> / overview</small></h1>{page==='Dashboard'?<Dashboard/>:<Feature title={page}/>}</section></main></div>
}
function Dashboard(){return <><p style={{color:'#777'}}>Dashboard Overview</p><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>{['Gold Price','Products Tracked','Active Jobs','Medical Alerts','Flights Tracked','Expenses Today','Expenses This Month','Upcoming Bills'].map((x,i)=><div style={{background:'#fff',border:'1px solid #e7e7ed',borderRadius:8,padding:18,minHeight:65}} key={x}><div style={{fontSize:12,color:'#777'}}>{x}</div><strong style={{fontSize:20}}>{i===0?'₹11,650/g':'0'}</strong></div>)}</div><button style={{position:'fixed',right:28,bottom:22,width:44,height:44,borderRadius:50,fontSize:24,border:0,background:'#6335e5',color:'#fff'}}>+</button></>}
function Feature({title}){return <div style={{background:'#fff',border:'1px solid #e3e3e8',borderRadius:8,padding:22,marginTop:20}}><h3>{title}</h3><p style={{color:'#777'}}>No data found</p><p style={{fontSize:13}}>Connect your service or add a tracker to start monitoring it.</p></div>}
