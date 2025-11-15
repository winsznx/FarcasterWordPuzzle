import { NextRequest, NextResponse } from 'next/server';
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
  ParseWebhookEvent,
} from '@farcaster/miniapp-node';
import { notificationTokenStore } from '@/lib/notificationTokens';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const requestJson = await request.json();

    console.log('Webhook received:', JSON.stringify(requestJson, null, 2));

    // Verify the webhook event
    let data;
    try {
      data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
    } catch (e: unknown) {
      const error = e as ParseWebhookEvent.ErrorType;

      console.error('Webhook verification failed:', error);

      switch (error.name) {
        case 'VerifyJsonFarcasterSignature.InvalidDataError':
        case 'VerifyJsonFarcasterSignature.InvalidEventDataError':
          return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
          );
        case 'VerifyJsonFarcasterSignature.InvalidAppKeyError':
          return NextResponse.json(
            { error: 'Invalid app key' },
            { status: 401 }
          );
        case 'VerifyJsonFarcasterSignature.VerifyAppKeyError':
          // Internal error verifying the app key (caller may want to try again)
          return NextResponse.json(
            { error: 'Error verifying app key' },
            { status: 500 }
          );
        default:
          return NextResponse.json(
            { error: 'Verification failed' },
            { status: 400 }
          );
      }
    }

    // Extract FID from verified data
    const fid = data.fid;

    // Handle different event types based on the event discriminator
    if (data.event.event === 'miniapp_added') {
      console.log(`Mini App added by FID ${fid}`);

      // Check if notification details are included
      if (data.event.notificationDetails) {
        const { token, url } = data.event.notificationDetails;
        notificationTokenStore.save(fid, token, url);
        console.log(`Notification token saved for FID ${fid}`);
      }
    } else if (data.event.event === 'notifications_enabled') {
      console.log(`Notifications enabled by FID ${fid}`);

      // Save the new notification token
      const { token, url } = data.event.notificationDetails;
      notificationTokenStore.save(fid, token, url);
      console.log(`Notification token saved for FID ${fid}`);
    } else if (data.event.event === 'notifications_disabled') {
      console.log(`Notifications disabled by FID ${fid}`);

      // Disable notifications for this user
      notificationTokenStore.disable(fid);
    } else if (data.event.event === 'miniapp_removed') {
      console.log(`Mini App removed by FID ${fid}`);

      // Remove all tokens for this user
      notificationTokenStore.remove(fid);
    } else {
      console.log(`Unknown event type`);
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for debugging (remove in production)
export async function GET() {
  const tokens = notificationTokenStore.getAll();
  return NextResponse.json({
    count: tokens.length,
    tokens: tokens.map(t => ({
      fid: t.fid,
      enabled: t.enabled,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
  });
}
