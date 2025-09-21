import React, { useState } from "react";
import api from '../services/api'; // Import the API service

export default function SentimentApp() {
  const [topic, setTopic] = useState("");
  const [sources, setSources] = useState({ reddit: true, twitter: false, youtube: false, tiktok: false, facebook: false });
  const [timeRange, setTimeRange] = useState("all");
  const [sort, setSort] = useState("relevant");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState(null);

  function toggleSource(key) {
    setSources((s) => ({ ...s, [key]: !s[key] }));
  }

  async function handleAnalyze() {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    const selectedSources = Object.keys(sources).filter(key => sources[key]);
    if (selectedSources.length === 0) {
      setError("Please select at least one source.");
      return;
    }

    setRunning(true);
    setResults(null);
    setJobId(null);
    setError(null);

    try {
      const job = await api.createJob(topic, selectedSources, timeRange, sort);
      setJobId(job.job_id);
      pollJobStatus(job.job_id);
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.message || "Failed to start analysis.");
      setRunning(false);
    }
  }

  async function pollJobStatus(id) {
    const interval = setInterval(async () => {
      try {
        const jobStatus = await api.getJobStatus(id);
        if (jobStatus.status === 'completed') {
          clearInterval(interval);
          setResults(jobStatus.results);
          setRunning(false);
        } else if (jobStatus.status === 'failed') {
          clearInterval(interval);
          setError("Analysis failed. Please try again.");
          setRunning(false);
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Error polling job status:", err);
        setError(err.message || "Failed to get analysis status.");
        setRunning(false);
      }
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Sentiment Lens</h1>
          <div className="text-sm text-slate-500">Analyze public opinion across social platforms</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Topic or keyword</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={"e.g. Sơn Tùng M-TP"}
              className="w-full rounded-lg border p-3 shadow-sm"
            />

            <div className="mt-3 text-sm text-slate-600">Sources</div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => toggleSource('reddit')} className={`px-3 py-1 rounded ${sources.reddit ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100'}`}>Reddit</button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm">Sort by</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded p-2 border">
                <option value="relevant">Relevant</option>
                <option value="hot">Hot</option>
                <option value="top">Top</option>
                <option value="new">New</option>
              </select>

              <label className="text-sm ml-4">Time range</label>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="rounded p-2 border" disabled={sort !== 'top'}>
                <option value="hour">Last hour</option>
                <option value="day">Last 24 hours</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
                <option value="year">Last year</option>
                <option value="all">All time</option>
              </select>

              <button onClick={handleAnalyze} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded shadow hover:opacity-95">
                {running ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {jobId && running && <div className="text-blue-500 text-sm mt-2">Analysis Job ID: {jobId} - Status: Processing...</div>}
          </div>

          <aside className="bg-slate-50 rounded p-4">
            <div className="text-xs text-slate-500">Quick tips</div>
            <ul className="text-sm mt-3 list-disc list-inside text-slate-700">
              <li>Use 'Top' sort to enable time range filtering.</li>
              <li>'Relevant' is often the best choice for general topics.</li>
            </ul>
          </aside>
        </section>

        {results && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <div className="flex gap-4 items-center">
                  <div className="p-4 bg-slate-100 rounded">
                    <div className="text-xs text-slate-500">Positive</div>
                    <div className="text-2xl font-bold">{results.positive_score?.toFixed(1) || '0.0'}%</div>
                  </div>
                  <div className="p-4 bg-slate-100 rounded">
                    <div className="text-xs text-slate-500">Neutral</div>
                    <div className="text-2xl font-bold">{results.neutral_score?.toFixed(1) || '0.0'}%</div>
                  </div>
                  <div className="p-4 bg-slate-100 rounded">
                    <div className="text-xs text-slate-500">Negative</div>
                    <div className="text-2xl font-bold">{results.negative_score?.toFixed(1) || '0.0'}%</div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-xs text-slate-500">Net sentiment score</div>
                    <div className="text-2xl font-semibold">{results.net_score >= 0 ? '+' : ''}{results.net_score?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Word cloud (top words)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {results.word_cloud && Object.entries(results.word_cloud).map(([w, c]) => (
                      <div key={w} className="px-3 py-1 rounded bg-slate-100 text-sm">{w} ({c})</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">Filters</h3>
                <div className="text-sm text-slate-600">Source: All</div>
                <div className="text-sm text-slate-600">Language: All</div>
                <div className="text-sm text-slate-600">Location: Worldwide</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-3">Timeline</h4>
                <div className="text-sm text-slate-500">(interactive chart placeholder)</div>
                <div className="mt-3 text-xs text-slate-600">
                  {results.timeline_data && results.timeline_data.map((pt, index) => (
                    <div key={index} className="flex justify-between py-1 border-b"><div>{pt.t}</div><div>+{pt.p?.toFixed(1) || '0'}/-{pt.n?.toFixed(1) || '0'}</div></div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-3">Top mentions</h4>
                <ul className="space-y-2 text-sm">
                  <li className="p-2 rounded border-l-4 border-slate-200">
                    <div className="text-sm">Mock Top Mention 1: This is a positive comment.</div>
                    <div className="text-xs text-slate-500 mt-1">Reddit • positive</div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-6 text-xs text-slate-500 text-center">Prototype — data sources and backend required to run full analysis</footer>
      </div>
    </div>
  );
}
