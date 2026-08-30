// scripts/embed-laws.mjs
// ─────────────────────────────────────────────────────────────────────────────
// One-time script: reads all .txt files from data/acts/, chunks them by section,
// embeds with OpenAI text-embedding-3-small, and uploads to Pinecone.
//
// Usage:
//   node scripts/embed-laws.mjs
//
// Env vars required (in .env or shell):
//   OPENAI_API_KEY
//   PINECONE_API_KEY
//   PINECONE_INDEX_HOST
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load .env and .env.local
config({ path: '.env' });
config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OPENAI_KEY     = process.env.OPENAI_API_KEY;
const PINECONE_KEY   = process.env.PINECONE_API_KEY;
const PINECONE_HOST  = process.env.PINECONE_INDEX_HOST;

// ─── Validation ───────────────────────────────────────────────────────────────
if (!OPENAI_KEY)    { console.error('❌ Missing OPENAI_API_KEY');    process.exit(1); }
if (!PINECONE_KEY)  { console.error('❌ Missing PINECONE_API_KEY');  process.exit(1); }
if (!PINECONE_HOST) { console.error('❌ Missing PINECONE_INDEX_HOST'); process.exit(1); }

console.log('✅ API keys loaded');
console.log(`   Pinecone host: ${PINECONE_HOST}`);

// ─── 1. Read act files ────────────────────────────────────────────────────────
const actsDir = path.join(__dirname, '..', 'data', 'acts');

if (!fs.existsSync(actsDir)) {
  console.error(`❌ Acts directory not found: ${actsDir}`);
  console.error('   Create data/acts/ and add .txt files first.');
  process.exit(1);
}

const actFiles = fs.readdirSync(actsDir).filter(f => f.endsWith('.txt'));

if (actFiles.length === 0) {
  console.error('❌ No .txt files found in data/acts/');
  console.error('   See data/acts/README.md for instructions.');
  process.exit(1);
}

console.log(`\n📚 Found ${actFiles.length} act file(s):`);
actFiles.forEach(f => console.log(`   • ${f}`));

// ─── 2. Chunk an act text into sections ───────────────────────────────────────
function chunkAct(text, actName, fileName) {
  const chunks = [];
  const MAX_CHARS = 2000; // ~500 tokens — safe for embedding

  // Strategy A: Split on "Section X" pattern (most Indian acts)
  const sectionPattern = /(?=Section\s+\d+[A-Z]?\s*[\.\-–\:])/gi;
  const sections = text.split(sectionPattern).filter(s => s.trim().length > 50);

  if (sections.length > 1) {
    for (const section of sections) {
      const numMatch = section.match(/Section\s+(\d+[A-Z]?)/i);
      const sectionNum = numMatch ? numMatch[1] : 'General';
      const lines = section.trim().split('\n');
      const title = lines[0].trim().slice(0, 120);
      const content = section.trim().slice(0, MAX_CHARS);

      if (content.length < 30) continue;

      chunks.push({
        id: `${fileName}-s${sectionNum}-${randomId()}`,
        text: `${actName} — Section ${sectionNum}\n${content}`,
        metadata: {
          actName,
          fileName,
          sectionNumber: sectionNum,
          sectionTitle: title,
          source: 'Indian Law Database',
        },
      });
    }
  }

  // Strategy B: Fallback — chunk by double newline paragraphs
  if (chunks.length === 0) {
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 80);
    paragraphs.forEach((para, i) => {
      chunks.push({
        id: `${fileName}-p${i}-${randomId()}`,
        text: `${actName}\n${para.trim().slice(0, MAX_CHARS)}`,
        metadata: {
          actName,
          fileName,
          sectionNumber: String(i + 1),
          sectionTitle: para.trim().split('\n')[0].slice(0, 100),
          source: 'Indian Law Database',
        },
      });
    });
  }

  return chunks;
}

function randomId() {
  return Math.random().toString(36).slice(2, 7);
}

// ─── 3. Embed texts via OpenAI ────────────────────────────────────────────────
async function embedTexts(texts) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: texts,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(`OpenAI error: ${data.error.message}`);
  return data.data.map(d => d.embedding);
}

// ─── 4. Upsert vectors to Pinecone ────────────────────────────────────────────
async function upsertToPinecone(vectors) {
  const response = await fetch(`${PINECONE_HOST}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': PINECONE_KEY,
    },
    body: JSON.stringify({ vectors }),
  });

  const data = await response.json();
  if (data.upsertedCount !== undefined) {
    return data.upsertedCount;
  }
  if (data.error) throw new Error(`Pinecone error: ${JSON.stringify(data.error)}`);
  return vectors.length;
}

// ─── 5. Main ──────────────────────────────────────────────────────────────────
async function main() {
  let totalChunks   = 0;
  let totalUploaded = 0;
  let totalErrors   = 0;

  const BATCH_SIZE = 50;    // OpenAI max per request
  const RATE_DELAY = 600;   // ms between batches (avoid rate limits)

  for (const file of actFiles) {
    const actName = file
      .replace('.txt', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    console.log(`\n─── Processing: ${actName} ──────────────────────`);

    const text = fs.readFileSync(path.join(actsDir, file), 'utf-8');
    const chunks = chunkAct(text, actName, file.replace('.txt', ''));

    console.log(`   📄 ${chunks.length} chunks created`);
    totalChunks += chunks.length;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch  = chunks.slice(i, i + BATCH_SIZE);
      const batchN = Math.floor(i / BATCH_SIZE) + 1;
      const totalB = Math.ceil(chunks.length / BATCH_SIZE);

      process.stdout.write(`   Batch ${batchN}/${totalB} — embedding... `);

      try {
        const texts      = batch.map(c => c.text);
        const embeddings = await embedTexts(texts);

        const vectors = batch.map((chunk, idx) => ({
          id: chunk.id,
          values: embeddings[idx],
          metadata: chunk.metadata,
        }));

        const uploaded = await upsertToPinecone(vectors);
        totalUploaded += uploaded;

        console.log(`✅ ${uploaded} vectors uploaded (total: ${totalUploaded})`);

        // Respect rate limits
        await new Promise(r => setTimeout(r, RATE_DELAY));

      } catch (err) {
        totalErrors++;
        console.error(`\n   ❌ Batch ${batchN} failed: ${err.message}`);
        // Continue with next batch instead of aborting
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`✅ Done!`);
  console.log(`   Acts processed : ${actFiles.length}`);
  console.log(`   Total chunks   : ${totalChunks}`);
  console.log(`   Vectors stored : ${totalUploaded}`);
  if (totalErrors > 0) {
    console.log(`   ⚠️  Batch errors : ${totalErrors} (re-run to retry)`);
  }
  console.log('═══════════════════════════════════════════════════');
  console.log('\nYour Pinecone index is ready! Restart your Next.js server and');
  console.log('test with a deposit or salary dispute to see real section citations.\n');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
