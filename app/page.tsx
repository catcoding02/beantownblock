'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Inter, Lora, Sour_Gummy, Bad_Script, Inclusive_Sans} from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const lora = Lora({ subsets: ['latin'] });
const sour_gummy = Sour_Gummy({
  subsets: ['latin'],
  weight: '400', // Adjust as needed; 400 is the regular weight
});
const bad_script = Bad_Script({
  subsets: ['latin'],
  weight: '400', // Adjust as needed; 400 is the regular weight
});
const inc_sans = Inclusive_Sans({
  subsets: ['latin'],
  weight: '400', // Adjust as needed; 400 is the regular weight
});

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
    <main className="bg-yellow-50 relative flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className={`text-2xl text-black font-bold mb-4 ${sour_gummy.className}`}>{today}</h1>

{/* Display today's row if available */}
      {todayRow && (
        <div className="mt-6 space-y-4">
          <div className="text-center text-black">
            <h2 className={`bg-orange-300 px-4 px-2 rounded-xl inline block font-semibold text-lg text-black mb-2 ${sour_gummy.className}`}>Run</h2>
            <p className={bad_script.className}>{todayRow.Run || 'None'}</p>
          </div>
          <div className="text-center text-black">
            <h2 className={`bg-orange-300 px-4 px-2 rounded-xl inline block font-semibold text-lg text-black mb-2 ${sour_gummy.className}`}>Strength</h2>
            <p className={bad_script.className}>{todayRow.Strength || 'None'}</p>
          </div>
          <div className="text-center text-black">
            <h2 className={`bg-orange-300 px-4 px-2 rounded-xl inline block font-semibold text-lg text-black mb-2 ${sour_gummy.className}`}>Extra Fun!</h2>
            <p className={bad_script.className}>{todayRow.Extra || 'None'}</p>
          </div>
        </div>
      )}
	
{/* Main content */}
      <h1 className={`bg-green-300 px-4 px-2 rounded-xl inline block text-xl text-black font-bold mb-4 ${sour_gummy.className}`}>Daily Tweak-o-Meter</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 text-black">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className={`text-md w-64 ${inc_sans.className}`}
        />
        <span className={`text-black ${inc_sans.className}`}>Value: {value}</span>
        <button
          type="submit"
          className={`px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-700 ${sour_gummy.className}`}
        >
          Submit
        </button>
      </form>

{/* Right column stats */}
      <div className="mt-5 py-1 px-1 top-4 right-4 items-center justify-items-center rounded shadow space-y-2 text-black">
        <h1 className={`bg-fuchsia-300 px-4 px-2 rounded-xl inline block text-xl text-black font-bold text-right ${sour_gummy.className}`}>Tweak Stats</h1>

        <h2 className={`py-3 text-lg font-semibold text-center ${bad_script.className}`}>Latest Tweak</h2>
        <p className={`text-xl text-center ${inc_sans.className}`}>
          {submittedValue !== null ? submittedValue : '—'}
        </p>

        <h2 className={`text-lg font-semibold text-center ${bad_script.className}`}>Overall Tweak</h2>
        <p className={`text-xl text-center ${inc_sans.className}`}>
          {average !== null ? average.toFixed(2) : '—'}
        </p>

        <h2 className={`text-lg font-semibold text-center ${bad_script.className}`}>Total Tweaks</h2>
        <p className={`text-xl text-center ${inc_sans.className}`}>{count}</p>
      </div>

      
<div className = "text-2xl">
	<button
  onClick={() => window.open('https://docs.google.com/spreadsheets/d/e/2PACX-1vTx6iLWki68uyx_XNRhjw__EjKDxY3bdrUQT7LGXDk6ClqHsoh6EfEdxjqJQt3rc4fxMzE3Bbvvs6lx/pubhtml', '_blank')}
  className={`mt-4 px-4 py-2 bg-blue-300 text-black rounded hover:bg-green-700 transition ${sour_gummy.className}`}
>
  View Running Plan
</button>
</div>

<div className = "text-2xl">
	<button
  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1Zyy9vY5Yho1HtgwurCtbs4IBZvFgDJWLwS5BNG5mZw4/edit?usp=sharing', '_blank')}
  className={`mt-4 px-4 py-2 bg-blue-300 text-black rounded hover:bg-green-700 transition ${sour_gummy.className}`}
>
  View Strength Plan
</button>
</div>

    </main>
  );
}
