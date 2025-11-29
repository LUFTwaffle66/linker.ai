import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  console.log('Freelancer onboarding POST body:', body);

  return NextResponse.json(
    {
      success: true,
      message: 'Freelancer onboarding dummy endpoint OK',
      received: body ?? null,
    },
    { status: 200 },
  );
}
