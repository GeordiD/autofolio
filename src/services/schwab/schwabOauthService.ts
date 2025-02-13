import { db } from '@/db/client';
import { schwabOauths } from '@/db/schema/schwabOauths';
import { eq } from 'drizzle-orm';

export class SchwabOauthService {
  private appKey: string;
  private secret: string;
  private redirectUri: string;

  constructor() {
    this.appKey = process.env.SCHWAB_API_KEY ?? '';
    this.secret = process.env.SCHWAB_API_SECRET ?? '';
    this.redirectUri = process.env.SCHWAB_REDIRECT_URI ?? '';
  }

  buildUrl() {
    const redirectUrl = this.redirectUri;
    const url = `https://api.schwabapi.com/v1/oauth/authorize?client_id=${this.appKey}&redirect_uri=${redirectUrl}`;

    return url;
  }

  async fetchToken({ code, userId }: { code: string; userId: number }) {
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
    });

    const result = await fetch('https://api.schwabapi.com/v1/oauth/token', {
      method: 'POST',
      headers: this.getTokenHeaders(),
      body: payload,
    });

    const resultJson = (await result.json()) as {
      access_token: string;
      id_token: string;
      refresh_token: string;
    };

    console.log(resultJson);

    await this.storeOauthData({
      userId,
      access_token: resultJson.access_token,
      id_token: resultJson.id_token,
      refresh_token: resultJson.refresh_token,
    });
  }

  async refreshToken(userId: number) {
    const refresh_token = (
      await db.query.schwabOauths.findFirst({
        where: eq(schwabOauths.userId, userId),
        columns: { refresh_token: true },
      })
    )?.refresh_token;

    if (!refresh_token) {
      throw Error('no refresh token stored. Please reauth again');
    }

    const result = await fetch('https://api.schwabapi.com/v1/oauth/token', {
      method: 'POST',
      headers: this.getTokenHeaders(),
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    const {
      access_token,
      id_token,
      refresh_token: new_refresh_token,
    } = (await result.json()) as {
      access_token: string;
      id_token: string;
      refresh_token: string;
    };

    await this.storeOauthData({
      userId,
      access_token,
      id_token,
      refresh_token: new_refresh_token,
    });
  }

  async getAccessToken(userId: number): Promise<string | undefined> {
    return (
      await db.query.schwabOauths.findFirst({
        where: eq(schwabOauths.userId, userId),
        columns: { access_token: true },
      })
    )?.access_token;
  }

  private getTokenHeaders() {
    const credentials = Buffer.from(`${this.appKey}:${this.secret}`).toString(
      'base64'
    );
    return {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  private async storeOauthData({
    userId,
    access_token,
    id_token,
    refresh_token,
  }: {
    userId: number;
    access_token: string;
    id_token: string;
    refresh_token: string;
  }) {
    const hasExistingCode = await db.query.schwabOauths.findFirst({
      where: eq(schwabOauths.userId, userId),
    });

    if (hasExistingCode) {
      await db
        .update(schwabOauths)
        .set({
          access_token,
          id_token,
          refresh_token,
        })
        .where(eq(schwabOauths.userId, userId));
    } else {
      await db.insert(schwabOauths).values({
        userId,
        access_token,
        id_token,
        refresh_token,
      });
    }
  }
}

export const schwabOauthService = new SchwabOauthService();
