import { NextRequest, NextResponse } from 'next/server';
import { getDictionary } from '../../dictionaries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let locale = searchParams.get('locale') || 'vi';
  if (locale !== 'en' && locale !== 'vi') locale = 'vi';

  try {
    const dict = await getDictionary(locale as 'en' | 'vi');
    return NextResponse.json(dict);
  } catch (error) {
    return NextResponse.json({ error: 'Dictionary not found' }, { status: 404 });
  }
}
