# Trading Terminal PRO – Free Edition

## Çfarë përmban
- Web app responsive për iPhone, iPad dhe desktop.
- Grafik candlestick me EMA 9/21 dhe panel MACD.
- Analizë teknike EMA, RSI(14), MACD dhe ATR.
- Skaner për Commodities, Forex, Shares, Indices, Crypto dhe ETFs.
- Kalkulator pozicioni me leverage, Entry, TP dhe SL.
- Backend proxy për të dhënat OHLC përmes Cloudflare Pages Functions.
- PWA bazë (Add to Home Screen).

## Publikimi falas në Cloudflare Pages
Ky projekt nuk mund të publikohet në internet nga kjo bisedë pa hyrje në llogarinë tënde. Skedarët janë gati për t'u ngarkuar.

1. Shkarko dhe hap ZIP-in.
2. Hyr në https://dash.cloudflare.com/ dhe krijo një llogari falas.
3. Krijo një repository të ri në GitHub (mund të jetë public) dhe ngarko të gjithë skedarët/folderat e projektit duke ruajtur strukturën, sidomos `functions/api/market.js`.
4. Në Cloudflare hap **Workers & Pages → Create application → Pages → Connect to Git** dhe lidhe repository-n.
5. Zgjidh framework preset **None**; lëre Build command bosh dhe vendos Build output directory si `/` (root i repository-t).
6. Publikoje. Cloudflare Pages do të publikojë faqen dhe funksionin `/api/market` bashkë me të.
7. Hape URL-në `https://emri-i-projektit.pages.dev` në Safari.
8. Në iPhone: Share → Add to Home Screen.

## Testi i parë
Hape faqen e publikuar dhe kontrollo:
- statusi të bëhet ONLINE;
- grafiku i Gold të shfaqë qirinj;
- tab-i ANALIZA të tregojë RSI/MACD/EMA;
- skaneri të japë rezultate për një kategori të vogël fillimisht.

## Kufizime të rëndësishme
- Të dhënat vijnë nga endpoint-i i grafikut Yahoo Finance, një burim publik jozyrtar. Mund të ndryshojë, të kufizojë kërkesat ose të mos ofrojë çdo simbol/interval.
- 4h krijohet duke bashkuar qirinjtë 1h në aplikacion.
- Disa simbole mund të mos kenë të dhëna, sidomos ETF/indekse të caktuara ose instrumente jashtë orarit.
- TradingView nuk përdoret si burim i të dhënave në këtë version; grafikët vizatohen nga të dhënat OHLC të API-së së aplikacionit.
- Nuk ka lidhje me llogarinë Plus500, nuk ekzekuton urdhra dhe nuk garanton sinjale.
- Për përdorim të qëndrueshëm komercial duhen të dhëna nga ofrues me API dhe licencë të qartë.

## Siguria
Ky endpoint është proxy leximi për të dhëna publike. Nuk ruan fjalëkalime, API keys ose të dhëna të llogarisë së brokerit.
