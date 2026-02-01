import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Add headers to mimic a browser or a legitimate client to avoid being dropped
    const response = await fetch(`https://equran.id/api/v2/surat/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      // Add cache control to avoid hitting the external API too frequently
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // The external API returns { code: 200, message: "...", data: { ... } }
    // We want to return the 'data' part which contains the Surah object
    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Proxy Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surah data' },
      { status: 500 }
    );
  }
}
