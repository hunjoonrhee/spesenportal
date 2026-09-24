// Erzeugt deterministische Seed-Daten für das Backend (backend/data/*.json).
// Aufruf: node scripts/generate-seed.mjs
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

let s = 20260928;
const rand = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const round2 = (n) => Math.round(n * 100) / 100;

const costCenters = [
  { id: 'cc-1000', code: '1000', name: 'Geschäftsführung', parentId: null, responsibleUserId: null },
  { id: 'cc-1100', code: '1100', name: 'Vertrieb', parentId: 'cc-1000', responsibleUserId: 'u-06' },
  { id: 'cc-1110', code: '1110', name: 'Vertrieb Nord', parentId: 'cc-1100', responsibleUserId: 'u-06' },
  { id: 'cc-1120', code: '1120', name: 'Vertrieb Süd', parentId: 'cc-1100', responsibleUserId: 'u-06' },
  { id: 'cc-1200', code: '1200', name: 'IT', parentId: 'cc-1000', responsibleUserId: 'u-07' },
  { id: 'cc-1210', code: '1210', name: 'Softwareentwicklung', parentId: 'cc-1200', responsibleUserId: 'u-07' },
  { id: 'cc-1220', code: '1220', name: 'IT-Betrieb', parentId: 'cc-1200', responsibleUserId: 'u-07' },
  { id: 'cc-1300', code: '1300', name: 'Verwaltung', parentId: 'cc-1000', responsibleUserId: 'u-08' },
  { id: 'cc-1310', code: '1310', name: 'Buchhaltung', parentId: 'cc-1300', responsibleUserId: 'u-08' },
  { id: 'cc-1320', code: '1320', name: 'Personal', parentId: 'cc-1300', responsibleUserId: 'u-08' },
];

const users = [
  { id: 'u-01', name: 'Anna Becker', email: 'anna.becker@nordwerk.example', role: 'EMPLOYEE', costCenterId: 'cc-1110' },
  { id: 'u-02', name: 'Lukas Wagner', email: 'lukas.wagner@nordwerk.example', role: 'EMPLOYEE', costCenterId: 'cc-1210' },
  { id: 'u-03', name: 'Mehmet Yilmaz', email: 'mehmet.yilmaz@nordwerk.example', role: 'EMPLOYEE', costCenterId: 'cc-1120' },
  { id: 'u-04', name: 'Julia Schröder', email: 'julia.schroeder@nordwerk.example', role: 'EMPLOYEE', costCenterId: 'cc-1220' },
  { id: 'u-05', name: 'Felix Hoffmann', email: 'felix.hoffmann@nordwerk.example', role: 'EMPLOYEE', costCenterId: 'cc-1320' },
  { id: 'u-06', name: 'Claudia Richter', email: 'claudia.richter@nordwerk.example', role: 'APPROVER', costCenterId: 'cc-1100' },
  { id: 'u-07', name: 'Stefan Krüger', email: 'stefan.krueger@nordwerk.example', role: 'APPROVER', costCenterId: 'cc-1200' },
  { id: 'u-08', name: 'Petra Neumann', email: 'petra.neumann@nordwerk.example', role: 'ACCOUNTING', costCenterId: 'cc-1310' },
];

const categories = [
  { id: 'cat-01', key: 'HOTEL', label: 'Übernachtung', range: [79, 219] },
  { id: 'cat-02', key: 'TRAIN', label: 'Bahnfahrt', range: [19, 149] },
  { id: 'cat-03', key: 'FLIGHT', label: 'Flug', range: [89, 480] },
  { id: 'cat-04', key: 'TAXI', label: 'Taxi', range: [12, 58] },
  { id: 'cat-05', key: 'RENTAL_CAR', label: 'Mietwagen', range: [65, 240] },
  { id: 'cat-06', key: 'FUEL', label: 'Kraftstoff', range: [35, 95] },
  { id: 'cat-07', key: 'PARKING', label: 'Parken', range: [4, 32] },
  { id: 'cat-08', key: 'HOSPITALITY', label: 'Bewirtung', range: [38, 260] },
  { id: 'cat-09', key: 'PER_DIEM', label: 'Verpflegungsmehraufwand', range: [14, 28] },
  { id: 'cat-10', key: 'OFFICE', label: 'Büromaterial', range: [6, 85] },
  { id: 'cat-11', key: 'SOFTWARE', label: 'Software & Abos', range: [9, 120] },
  { id: 'cat-12', key: 'OTHER', label: 'Sonstiges', range: [5, 150] },
];

const trips = ['Kundentermin Hamburg', 'Messe Köln', 'Teamworkshop Bonn', 'Kundentermin München', 'Schulung Frankfurt',
  'Projekt-Kickoff Düsseldorf', 'Lieferantengespräch Stuttgart', 'Quartalsmeeting Berlin', 'Kundentermin Zürich',
  'Konferenz Amsterdam', 'Vor-Ort-Support Dortmund', 'Recruiting-Messe Aachen'];
const rates = { EUR: 1, CHF: 1.07, USD: 0.92 };

const expenses = [];
const start = new Date(Date.UTC(2026, 3, 1));
const end = new Date(Date.UTC(2026, 8, 22));
const days = Math.round((end - start) / 86400000);

for (let i = 0; i < 152; i++) {
  const employee = rand() < 0.86 ? pick(users.slice(0, 5)) : pick(users.slice(5, 8));
  const cat = pick(categories);
  const d = new Date(start.getTime() + Math.floor(rand() * days) * 86400000);
  const date = d.toISOString().slice(0, 10);
  const trip = pick(trips);
  const currency = trip.includes('Zürich') ? 'CHF' : trip.includes('Amsterdam') && rand() < 0.3 ? 'USD' : rand() < 0.04 ? 'USD' : 'EUR';
  const amount = round2(cat.range[0] + rand() * (cat.range[1] - cat.range[0]));
  const ageDays = (end - d) / 86400000;
  let status;
  const r = rand();
  if (ageDays > 45) status = r < 0.8 ? 'PAID' : r < 0.92 ? 'APPROVED' : 'REJECTED';
  else if (ageDays > 14) status = r < 0.45 ? 'APPROVED' : r < 0.8 ? 'SUBMITTED' : r < 0.9 ? 'PAID' : 'REJECTED';
  else status = r < 0.65 ? 'SUBMITTED' : r < 0.9 ? 'DRAFT' : 'APPROVED';

  const cc = costCenters.find((c) => c.id === employee.costCenterId);
  const approverId = cc.responsibleUserId ?? 'u-08';
  const submittedAt = status === 'DRAFT' ? null : new Date(d.getTime() + (1 + Math.floor(rand() * 4)) * 86400000).toISOString();
  const decided = ['APPROVED', 'PAID', 'REJECTED'].includes(status);
  expenses.push({
    id: `exp-${String(i + 1).padStart(4, '0')}`,
    employeeId: employee.id,
    date,
    categoryId: cat.id,
    amount,
    currency,
    amountEur: round2(amount * rates[currency]),
    costCenterId: employee.costCenterId,
    description: cat.key === 'OFFICE' || cat.key === 'SOFTWARE' ? `${cat.label} für Team` : `${trip} – ${cat.label}`,
    status,
    submittedAt,
    decidedAt: decided ? new Date(new Date(submittedAt).getTime() + (1 + Math.floor(rand() * 6)) * 86400000).toISOString() : null,
    decidedBy: decided ? approverId : null,
    rejectionReason: status === 'REJECTED' ? pick(['Beleg fehlt', 'Betrag übersteigt Richtlinie', 'Falsche Kostenstelle']) : null,
    receiptFileName: null,
  });
}
expenses.sort((a, b) => a.date.localeCompare(b.date));
expenses.forEach((e, i) => (e.id = `exp-${String(i + 1).padStart(4, '0')}`));

const out = resolve(import.meta.dirname, '../backend/data');
const write = (name, data) => writeFileSync(resolve(out, name), JSON.stringify(data, null, 2) + '\n');
write('cost-centers.json', costCenters);
write('users.json', users);
write('categories.json', categories.map(({ range, ...c }) => c));
write('expenses.json', expenses);
console.log(`Seed geschrieben: ${users.length} Nutzer, ${costCenters.length} Kostenstellen, ${categories.length} Kategorien, ${expenses.length} Ausgaben`);
