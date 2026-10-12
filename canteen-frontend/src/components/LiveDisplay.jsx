import React, { useEffect, useState } from 'react';
import { Tv, Bell, Clock } from 'lucide-react';
import api from '../api/api';

export default function LiveDisplay() {
  const [tokens, setTokens] = useState({ preparingTokens: ['T-002', 'T-004'], readyTokens: ['T-001', 'T-003'] });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const fetchLiveTokens = async () => {
    try {
      const res = await api.get('/display/live-tokens');
      if (res.data && (res.data.preparingTokens?.length > 0 || res.data.readyTokens?.length > 0)) {
        setTokens(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiveTokens();
    const tokenInterval = setInterval(fetchLiveTokens, 3000); 
    const clockInterval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div className="min-h-[85vh] bg-slate-950 text-white rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl border border-slate-800 my-4 max-w-7xl mx-auto">
      
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wide text-white">CAMPUS CANTEEN LIVE TOKENS</h1>
            <p className="text-xs text-slate-400 font-medium">Please proceed to Counter 1 when your token number turns GREEN</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-mono text-emerald-400 font-bold">
          <Clock className="w-4 h-4" /> {currentTime}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-6">
        
        <div className="bg-slate-900/60 rounded-3xl border border-amber-500/20 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h2 className="text-base font-black tracking-wider text-amber-400 flex items-center gap-2 uppercase">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
              Now Cooking
            </h2>
            <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg font-bold">
              {tokens.preparingTokens?.length || 0} IN PROGRESS
            </span>
          </div>

          <div className="flex flex-wrap gap-3 content-start flex-1">
            {tokens.preparingTokens?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm font-medium italic">
                No orders currently in preparation
              </div>
            ) : (
              tokens.preparingTokens?.map((tok) => (
                <div
                  key={tok}
                  className="bg-slate-800/80 border border-amber-400/40 text-amber-300 text-3xl md:text-4xl font-black px-6 py-4 rounded-2xl shadow-md"
                >
                  {tok}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-3xl border border-emerald-500/30 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h2 className="text-base font-black tracking-wider text-emerald-400 flex items-center gap-2 uppercase">
              <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
              Ready for Pickup
            </h2>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg font-bold">
              {tokens.readyTokens?.length || 0} READY
            </span>
          </div>

          <div className="flex flex-wrap gap-3 content-start flex-1">
            {tokens.readyTokens?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm font-medium italic">
                Orders being cooked... none ready yet
              </div>
            ) : (
              tokens.readyTokens?.map((tok) => (
                <div
                  key={tok}
                  className="bg-emerald-600 text-white text-3xl md:text-4xl font-black px-6 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 animate-pulse border border-emerald-400"
                >
                  {tok}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
