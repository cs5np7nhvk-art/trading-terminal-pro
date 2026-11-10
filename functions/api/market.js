
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get("symbol");
  const range = url.searchParams.get("range") || "5d";
  const interval = url.searchParams.get("interval") || "15m";

  const allowedRanges = new Set(["5d", "1mo", "6mo", "1y"]);
  const allowedIntervals = new Set(["5m", "15m", "60m", "1d"]);

  if (!symbol || symbol.length > 32 || !/^[A-Za-z0-9=.^_-]+$/.test(symbol)) {
    return Response.json({ error: "Simbol i pavlefshëm." }, { status: 400 });
  }

  if (!allowedRanges.has(range) || !allowedIntervals.has(interval)) {
    return Response.json({ error: "Interval ose periudhë e pambështetur." }, { status: 400 });
  }

  const target = new URL(
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(symbol)
  );

  target.searchParams.set("range", range);
  target.searchParams.set("interval", interval);
  target.searchParams.set("includePrePost", "false");

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 TradingTerminalPRO/1.0",
        "Accept": "application/json"
      },
      cf: {
        cacheTtl: 30,
        cacheEverything: true
      }
    });

    if (!upstream.ok) {
      return Response.json(
        { error: `Burimi i kuotave u përgjigj me HTTP ${upstream.status}.` },
        { status: 502 }
      );
    }

    const raw = await upstream.json();
    const result = raw?.chart?.result?.[0];

    if (!result) {
      return Response.json(
        { error: raw?.chart?.error?.description || "Burimi nuk ktheu të dhëna për këtë instrument." },
        { status: 404 }
      );
    }

    const quote = result.indicators?.quote?.[0];

    if (!quote || !result.timestamp) {
      return Response.json({ error: "Të dhënat OHLC mungojnë." }, { status: 404 });
    }

    const bars = [];

    for (let i = 0; i < result.timestamp.length; i++) {
      const o = quote.open?.[i];
      const h = quote.high?.[i];
      const l = quote.low?.[i];
      const c = quote.close?.[i];
      const v = quote.volume?.[i] || 0;

      if ([o, h, l, c].every(Number.isFinite)) {
        bars.push({
          time: result.timestamp[i],
          open: o,
          high: h,
          low: l,
          close: c,
          volume: v
        });
      }
    }

    if (!bars.length) {
      return Response.json(
        { error: "Nuk ka qirinj të vlefshëm për këtë simbol." },
        { status: 404 }
      );
    }

    return Response.json(
      {
        symbol,
        exchange: result.meta?.exchangeName || null,
        currency: result.meta?.currency || null,
        bars
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30",
          "X-Data-Source": "Yahoo Finance chart endpoint"
        }
      }
    );

  } catch (err) {
    return Response.json(
      { error: "Gabim në marrjen e të dhënave nga burimi: " + String(err?.message || err) },
      { status: 502 }
    );
  }
}
