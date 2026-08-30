# Indian Law Acts — Text Database

Place Indian law act text files here. One file per act, named clearly:

## Naming Convention
```
ipc.txt                      → Indian Penal Code 1860
consumer-protection.txt      → Consumer Protection Act 2019
payment-of-wages.txt         → Payment of Wages Act 1936
transfer-of-property.txt     → Transfer of Property Act 1882
industrial-disputes.txt      → Industrial Disputes Act 1947
hindu-marriage.txt           → Hindu Marriage Act 1955
domestic-violence.txt        → Protection of Women from DV Act 2005
it-act.txt                   → Information Technology Act 2000
contract-act.txt             → Indian Contract Act 1872
crpc.txt                     → Code of Criminal Procedure 1973
karnataka-rent.txt           → Karnataka Rent Control Act 2001
maharashtra-rent.txt         → Maharashtra Rent Control Act 1999
delhi-rent.txt               → Delhi Rent Control Act 1958
tn-buildings.txt             → Tamil Nadu Buildings (Lease) Act 1960
```

## Where to Get These Files (Free)

### Option A — Bare Acts GitHub (easiest)
```
https://github.com/devlup-labs/bare-acts
```
Many acts already available as plain text. Clone and copy relevant files.

### Option B — India Code (official)
```
https://indiacode.nic.in
```
Search any act → Download as PDF → Convert to text with:
```bash
pdftotext act.pdf act.txt
```
Or use an online PDF-to-text converter.

### Option C — IndianKanoon.org
```
https://indiankanoon.org
```
Search for any act, copy the text sections.

## After adding files, run the embedder:
```bash
node scripts/embed-laws.mjs
```

This will:
1. Read all .txt files in this folder
2. Split each into sections by "Section X" pattern
3. Embed each section using OpenAI text-embedding-3-small
4. Upload all vectors to your Pinecone index

**Estimated cost:** ₹150–200 in OpenAI API fees for ~50 acts  
**Time:** 10–15 minutes  
**Runs once** — no need to re-run unless you add new acts

## Environment Variables Required
Add these to your `.env.local` before running:
```
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_HOST=https://indian-law-xxxx.svc.pinecone.io
OPENAI_API_KEY=your_openai_key
```
