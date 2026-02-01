import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = searchParams.get('surah');
  const edition = searchParams.get('edition');

  if (!surah || !edition) {
    return NextResponse.json({ error: 'Missing surah or edition parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/${edition}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
