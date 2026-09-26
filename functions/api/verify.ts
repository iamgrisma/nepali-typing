// Cloudflare Pages Function: /api/verify
// Verifies certificate authenticity via Cloudflare D1

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing certificate id query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    if (env.DB) {
      const row = await env.DB.prepare('SELECT * FROM certificates WHERE id = ?').bind(id.trim()).first();
      if (row) {
        return new Response(JSON.stringify({
          valid: true,
          certificate: {
            id: row.id,
            candidateName: row.candidate_name,
            layout: row.layout,
            layoutLabel: row.layout_label,
            mode: row.mode,
            durationSeconds: row.duration_seconds,
            netWpm: row.net_wpm,
            rawWpm: row.raw_wpm,
            accuracy: row.accuracy,
            consistency: row.consistency,
            cpm: row.cpm,
            totalKeystrokes: row.total_keystrokes,
            correctKeystrokes: row.correct_keystrokes,
            errorKeystrokes: row.error_keystrokes,
            rankTitle: row.rank_title,
            rankBadge: row.rank_badge,
            status: row.status,
            issuedAt: row.issued_at,
            verificationUrl: row.verification_url,
            signature: row.signature
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    return new Response(JSON.stringify({
      valid: false,
      message: 'Certificate ID not found in database records'
    }), {
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
