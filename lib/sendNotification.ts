// Helper function to send notifications to users
// Based on Farcaster Mini App notifications spec

import { notificationTokenStore } from './notificationTokens';

export interface NotificationPayload {
  notificationId: string; // Unique ID for deduplication (max 128 chars)
  title: string; // Max 32 characters
  body: string; // Max 128 characters
  targetUrl: string; // Max 1024 characters, must be on same domain
  tokens: string[]; // Max 100 tokens per request
}

export interface NotificationResponse {
  successfulTokens: string[];
  invalidTokens: string[];
  rateLimitedTokens: string[];
}

/**
 * Send a notification to a specific user by FID
 */
export async function sendNotificationToUser(
  fid: number,
  notification: Omit<NotificationPayload, 'tokens'>
): Promise<NotificationResponse | null> {
  const tokenData = notificationTokenStore.get(fid);

  if (!tokenData || !tokenData.enabled) {
    console.warn(`No enabled notification token for FID ${fid}`);
    return null;
  }

  return sendNotification({
    ...notification,
    tokens: [tokenData.token],
  }, tokenData.url);
}

/**
 * Send a notification to multiple users
 */
export async function sendNotificationToMultipleUsers(
  fids: number[],
  notification: Omit<NotificationPayload, 'tokens'>
): Promise<NotificationResponse> {
  // Get all enabled tokens for the specified FIDs
  const tokens: string[] = [];
  let url: string | null = null;

  for (const fid of fids) {
    const tokenData = notificationTokenStore.get(fid);
    if (tokenData && tokenData.enabled) {
      tokens.push(tokenData.token);
      if (!url) url = tokenData.url; // Use first URL (they should all be the same)
    }
  }

  if (tokens.length === 0 || !url) {
    console.warn('No enabled notification tokens found for specified FIDs');
    return {
      successfulTokens: [],
      invalidTokens: [],
      rateLimitedTokens: [],
    };
  }

  // Batch tokens (max 100 per request)
  const batches: string[][] = [];
  for (let i = 0; i < tokens.length; i += 100) {
    batches.push(tokens.slice(i, i + 100));
  }

  // Send notifications in batches
  const results: NotificationResponse = {
    successfulTokens: [],
    invalidTokens: [],
    rateLimitedTokens: [],
  };

  for (const batch of batches) {
    const result = await sendNotification({
      ...notification,
      tokens: batch,
    }, url);

    results.successfulTokens.push(...result.successfulTokens);
    results.invalidTokens.push(...result.invalidTokens);
    results.rateLimitedTokens.push(...result.rateLimitedTokens);
  }

  return results;
}

/**
 * Send a notification to all users who have enabled notifications
 */
export async function sendNotificationToAll(
  notification: Omit<NotificationPayload, 'tokens'>
): Promise<NotificationResponse> {
  const allTokens = notificationTokenStore.getAllEnabled();
  const fids = allTokens.map(t => t.fid);
  return sendNotificationToMultipleUsers(fids, notification);
}

/**
 * Low-level function to send notification via HTTP
 */
async function sendNotification(
  payload: NotificationPayload,
  url: string
): Promise<NotificationResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

// Example usage:
//
// Send to a single user:
// await sendNotificationToUser(12345, {
//   notificationId: 'new-puzzle-2024-01-15',
//   title: 'New Puzzle Available!',
//   body: 'A new Level 2 puzzle is ready to solve!',
//   targetUrl: 'https://farcaster-word-puzzle.vercel.app',
// });
//
// Send to multiple users:
// await sendNotificationToMultipleUsers([12345, 67890], {
//   notificationId: 'daily-challenge-2024-01-15',
//   title: 'Daily Challenge',
//   body: 'Complete today\'s puzzle for bonus rewards!',
//   targetUrl: 'https://farcaster-word-puzzle.vercel.app',
// });
//
// Send to all users:
// await sendNotificationToAll({
//   notificationId: 'event-announcement-2024-01-15',
//   title: '2x Rewards Event!',
//   body: 'Double rewards on all puzzles this weekend!',
//   targetUrl: 'https://farcaster-word-puzzle.vercel.app',
// });
