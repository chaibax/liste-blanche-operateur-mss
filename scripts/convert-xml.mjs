import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const XML_URL = 'https://espacedeconfiance.mssante.fr/listeblanchemssante.xml';
const RAW_PATH = join(rootDir, 'public/data/listeblanchemssante.xml');
const JSON_PATH = join(rootDir, 'public/data/domaines.json');

console.log('Downloading XML...');
execSync(`curl -sk "${XML_URL}" -o "${RAW_PATH}"`);

console.log('Parsing XML...');
const xml = readFileSync(RAW_PATH, 'utf-8');

const dateGenMatch = xml.match(/<DateDeGeneration>(.*?)<\/DateDeGeneration>/);
const dateGeneration = dateGenMatch ? dateGenMatch[1] : null;

const domaines = [];
const regex = /<Domaine>([\s\S]*?)<\/Domaine>/g;
let match;

function extract(block, tag) {
  const m = block.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
  return m ? m[1].trim() : '';
}

function parseDN(dn) {
  const result = {};
  const fields = ['CN', 'OU', 'O', 'ST', 'C'];
  for (const f of fields) {
    const m = dn.match(new RegExp(`${f}=([^,]*)`));
    result[f.toLowerCase()] = m ? m[1].trim() : '';
  }
  const stMatch = result.st.match(/^(.*?)\s*\((\d+)\)$/);
  if (stMatch) {
    result.departement = stMatch[1].trim();
    result.codeDepartement = stMatch[2];
  }
  return result;
}

while ((match = regex.exec(xml)) !== null) {
  const block = match[1];
  const dn = extract(block, 'DNCertificatOperateur');
  const parsed = parseDN(dn);

  domaines.push({
    nom: extract(block, 'Nom'),
    description: extract(block, 'Description'),
    operateur: parsed.o,
    cn: parsed.cn,
    ou: parsed.ou,
    departement: parsed.departement || parsed.st,
    codeDepartement: parsed.codeDepartement || '',
    pays: parsed.c,
    responsableContact: extract(block, 'ResponsableContact'),
    supportContact: extract(block, 'SupportContact'),
    dateMaj: extract(block, 'DateMAJ'),
    dnBrut: dn,
  });
}

const output = {
  dateGeneration,
  totalDomaines: domaines.length,
  domaines,
};

writeFileSync(JSON_PATH, JSON.stringify(output, null, 2));
console.log(`Done: ${domaines.length} domaines exported to ${JSON_PATH}`);
