// In-memory storage for notification tokens
// WARNING: This will reset when the server restarts
// In production, use a real database (PostgreSQL, Redis, etc.)

export interface NotificationToken {
  fid: number;
  token: string;
  url: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class NotificationTokenStore {
  private tokens: Map<number, NotificationToken>;

  constructor() {
    this.tokens = new Map();
  }

  // Save or update a notification token for a user
  save(fid: number, token: string, url: string): void {
    const existing = this.tokens.get(fid);

    this.tokens.set(fid, {
      fid,
      token,
      url,
      enabled: true,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  }

  // Disable notifications for a user
  disable(fid: number): void {
    const existing = this.tokens.get(fid);
    if (existing) {
      this.tokens.set(fid, {
        ...existing,
        enabled: false,
        updatedAt: new Date(),
      });
    }
  }

  // Remove token when user removes the app
  remove(fid: number): void {
    this.tokens.delete(fid);
  }

  // Get token for a user
  get(fid: number): NotificationToken | undefined {
    return this.tokens.get(fid);
  }

  // Get all enabled tokens
  getAllEnabled(): NotificationToken[] {
    return Array.from(this.tokens.values()).filter(t => t.enabled);
  }

  // Get all tokens (for debugging)
  getAll(): NotificationToken[] {
    return Array.from(this.tokens.values());
  }
}

// Export singleton instance
export const notificationTokenStore = new NotificationTokenStore();
