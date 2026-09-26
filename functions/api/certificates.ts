// Cloudflare Pages Function: /api/certificates
// Inserts or retrieves typing certification test results into Cloudflare D1

interface Env {
  DB?: any;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const data = await request.json();

    if (!data.id || !data.candidateName || !data.netWpm) {
      return new Response(JSON.stringify({ error: 'Missing required certificate fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (env.DB) {
      // D1 Database is available in Cloudflare Pages
      await env.DB.prepare(`
        INSERT OR REPLACE INTO certificates (
          id, candidate_name, layout, layout_label, mode, duration_seconds,
          net_wpm, raw_wpm, accuracy, consistency, cpm,
          total_keystrokes, correct_keystrokes, error_keystrokes,
          rank_title, rank_badge, status, issued_at, verification_url, signature, analytics_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.id,
        data.candidateName,
        data.layout,
        data.layoutLabel,
        data.mode,
        data.durationSeconds || 0,
        data.netWpm,
        data.rawWpm || data.netWpm,
        data.accuracy || 100,
        data.consistency || 100,
        data.cpm || 0,
        data.totalKeystrokes || 0,
        data.correctKeystrokes || 0,
        data.errorKeystrokes || 0,
        data.rankTitle || 'Certified Typist',
        data.rankBadge || 'bronze',
        data.status || 'QUALIFIED',
        data.issuedAt || new Date().toISOString(),
        data.verificationUrl || `https://typing.topnepali.com/verify?id=${data.id}`,
        data.signature || '',
        JSON.stringify(data.analytics || {})
      ).run();
    }

    return new Response(JSON.stringify({ success: true, certificate: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing certificate id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    if (env.DB) {
      const result = await env.DB.prepare('SELECT * FROM certificates WHERE id = ?').bind(id).first();
      if (result) {
        return new Response(JSON.stringify({ success: true, certificate: result }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Certificate not found in D1' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
