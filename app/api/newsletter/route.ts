import { NextResponse } from 'next/server';
import { db } from '../../lib/firebaseAdmin';
import siteMetadata from '@/data/siteMetadata';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Add email to Firestore using Admin SDK
    await db.collection('newsletter_subscribers').add({
      email,
      subscribedAt: new Date(),
      from_website: siteMetadata.mainSiteUrl,
    });

    return NextResponse.json({ message: 'Successfully subscribed to the newsletter!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while subscribing' }, { status: 500 });
  }
}
