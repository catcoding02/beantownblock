// In-memory array to store values
let sliderValues: number[] = [];

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { sliderValue } = await req.json();
  sliderValues.push(sliderValue);

  // Calculate average
  const sum = sliderValues.reduce((acc, val) => acc + val, 0);
  const avg = sum / sliderValues.length;

  return NextResponse.json({
    received: sliderValue,
    average: avg,
    count: sliderValues.length
  });
}

export async function GET() {
  const sum = sliderValues.reduce((acc, val) => acc + val, 0);
  const avg = sliderValues.length > 0 ? sum / sliderValues.length : 0;

  return NextResponse.json({
    values: sliderValues,
    average: avg,
    count: sliderValues.length
  });
}