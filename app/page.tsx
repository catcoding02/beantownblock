'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [value, setValue] = useState(50);
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [todayRow, setTodayRow] = useState<any | null>(null);
  const today = new Date().toLocaleDateString('en-CA', {
  timeZone: 'America/New_York',
});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/submit-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sliderValue: value }),
      });

      const data = await res.json();
      setSubmittedValue(data.received);
      setAverage(data.average);
      setCount(data.count);
    } catch (err) {
      console.error(err);
      alert('Error submitting');
    }
  };

  // Fetch average and count on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/submit-slider');
        const data = await res.json();
        setAverage(data.average);
        setCount(data.count);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };
    fetchData();
  }, []);

  // Fetch today's row from CSV
  useEffect(() => {
    fetch('/data1.csv')
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        const rows = parsed.data as any[];
        const match = rows.find((row) => row.Date === today);
        setTodayRow(match || null);
      })
      .catch((err) => {
        console.error('Error fetching CSV:', err);
      });
  }, [today]);

  // Log when todayRow updates
  useEffect(() => {
    console.log('Updated todayRow:', todayRow);
  }, [todayRow]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4">
      {/* Display today's row if available */}
      {todayRow && (
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <h2 className="font-semibold text-lg mb-2">Run</h2>
            <p>{todayRow.Run || 'None'}</p>
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-lg mb-2">Strength</h2>
            <p>{todayRow.Strength || 'None'}</p>
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-lg mb-2">Extra Fun!</h2>
            <p>{todayRow.Extra || 'None'}</p>
          </div>
        </div>
      )}
	
{/* Main content */}
      <h1 className="text-2xl font-bold mb-4">{today}</h1>
      <h1 className="text-2xl font-bold mb-4">Daily Tweak-o-Meter</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-64"
        />
        <span>Value: {value}</span>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

{/* Right column stats */}
      <div className="top-4 right-4 items-center justify-items-center rounded shadow space-y-2">
        <h1 className="text-xl font-bold text-right">Average Tweak</h1>

        <h2 className="text-lg font-semibold text-right">Latest Tweak</h2>
        <p className="text-xl text-right">
          {submittedValue !== null ? submittedValue : '—'}
        </p>

        <h2 className="text-lg font-semibold text-right">Overall Tweak</h2>
        <p className="text-xl text-right">
          {average !== null ? average.toFixed(2) : '—'}
        </p>

        <h2 className="text-lg font-semibold text-right">Total Tweaks</h2>
        <p className="text-xl text-right">{count}</p>
      </div>

      
<div className = "text-2xl">
	<button
  onClick={() => window.open('https://docs.google.com/spreadsheets/d/e/2PACX-1vTx6iLWki68uyx_XNRhjw__EjKDxY3bdrUQT7LGXDk6ClqHsoh6EfEdxjqJQt3rc4fxMzE3Bbvvs6lx/pubhtml', '_blank')}
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
>
  View Running Plan
</button>
</div>

<div className = "text-2xl">
	<button
  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1Zyy9vY5Yho1HtgwurCtbs4IBZvFgDJWLwS5BNG5mZw4/edit?usp=sharing', '_blank')}
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
>
  View Strength Plan
</button>
</div>

    </main>
  );
}
