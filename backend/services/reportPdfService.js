function escapePdfText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('en-IN') : 'N/A';
}

function sanitize(value, fallback = 'N/A') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function wrapText(value, maxChars) {
  const text = sanitize(value, '');
  if (!text) return [''];

  const paragraphs = text.replace(/\r/g, '').split('\n');
  const lines = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(/\s+/);
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxChars) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        if (word.length <= maxChars) {
          current = word;
        } else {
          for (let i = 0; i < word.length; i += maxChars) {
            lines.push(word.slice(i, i + maxChars));
          }
          current = '';
        }
      }
    }

    if (current) lines.push(current);
  }

  return lines.length ? lines : [''];
}

function statusColor(status) {
  switch (String(status || '').toLowerCase()) {
    case 'approved':
      return [0.10, 0.62, 0.37];
    case 'rejected':
      return [0.83, 0.24, 0.31];
    default:
      return [0.85, 0.58, 0.12];
  }
}

function recommendationColor(recommendation) {
  switch (String(recommendation || '').toLowerCase()) {
    case 'approve':
      return [0.02, 0.52, 0.78];
    case 'reject':
      return [0.88, 0.19, 0.42];
    default:
      return [0.42, 0.35, 0.80];
  }
}

function addText(commands, text, x, y, options = {}) {
  const font = options.font || 'F1';
  const size = options.size || 12;
  const color = options.color || [0, 0, 0];
  commands.push('BT');
  commands.push(`/${font} ${size} Tf`);
  commands.push(`${color[0]} ${color[1]} ${color[2]} rg`);
  commands.push(`${x} ${y} Td`);
  commands.push(`(${escapePdfText(text)}) Tj`);
  commands.push('ET');
}

function addRect(commands, x, y, width, height, options = {}) {
  const fill = options.fill;
  const stroke = options.stroke;
  const lineWidth = options.lineWidth || 1;

  commands.push('q');
  if (fill) commands.push(`${fill[0]} ${fill[1]} ${fill[2]} rg`);
  if (stroke) commands.push(`${stroke[0]} ${stroke[1]} ${stroke[2]} RG`);
  commands.push(`${lineWidth} w`);
  commands.push(`${x} ${y} ${width} ${height} re`);
  commands.push(fill && stroke ? 'B' : fill ? 'f' : 'S');
  commands.push('Q');
}

function addDivider(commands, y) {
  commands.push('q');
  commands.push('0.88 0.90 0.94 RG');
  commands.push('1 w');
  commands.push(`42 ${y} m 570 ${y} l S`);
  commands.push('Q');
}

function addWrappedBlock(commands, label, value, x, startY, width, palette = {}) {
  const labelColor = palette.labelColor || [0.15, 0.24, 0.38];
  const bodyColor = palette.bodyColor || [0.24, 0.28, 0.35];
  const background = palette.background || [0.97, 0.98, 1.0];
  const border = palette.border || [0.86, 0.90, 0.95];
  const labelLines = wrapText(label, 40);
  const bodyLines = wrapText(value, 74);
  const height = 18 + (labelLines.length * 14) + 10 + (bodyLines.length * 14) + 18;

  addRect(commands, x, startY - height, width, height, {
    fill: background,
    stroke: border,
    lineWidth: 1,
  });

  let y = startY - 22;
  labelLines.forEach(line => {
    addText(commands, line, x + 14, y, { font: 'F2', size: 10, color: labelColor });
    y -= 14;
  });

  y -= 6;
  bodyLines.forEach(line => {
    addText(commands, line, x + 14, y, { font: 'F1', size: 11, color: bodyColor });
    y -= 14;
  });

  return height;
}

function buildContentStream(report) {
  const commands = [];
  const status = sanitize(report.status, 'pending');
  const recommendation = sanitize(report.recommendation, 'hold');
  const volunteerName = sanitize(report.verified_by?.name || report.verified_by?.email, 'Unknown Volunteer');
  const details = report.verificationDetails || {};

  addRect(commands, 0, 0, 612, 792, { fill: [0.98, 0.99, 1.0] });
  addRect(commands, 0, 730, 612, 62, { fill: [0.05, 0.33, 0.57] });
  addRect(commands, 0, 720, 612, 10, { fill: [0.80, 0.24, 0.45] });

  addText(commands, 'HRAVINDER', 42, 760, { font: 'F2', size: 24, color: [1, 1, 1] });
  addText(commands, 'Volunteer Verification Report', 42, 740, { font: 'F1', size: 12, color: [0.86, 0.93, 0.99] });
  addText(commands, `Generated: ${formatDate(new Date())}`, 398, 740, { font: 'F1', size: 10, color: [0.86, 0.93, 0.99] });

  addText(commands, 'Case Summary', 42, 695, { font: 'F2', size: 15, color: [0.08, 0.15, 0.27] });
  addText(commands, 'Structured audit copy for admin review and record-keeping', 42, 678, {
    font: 'F1',
    size: 10,
    color: [0.39, 0.46, 0.58],
  });

  const cards = [
    { title: 'Report ID', value: sanitize(report._id) },
    { title: 'Volunteer', value: volunteerName },
    { title: 'Needy Type', value: sanitize(report.needy_type) },
    { title: 'Submitted', value: formatDate(report.createdAt) },
  ];

  let cardX = 42;
  for (const card of cards) {
    addRect(commands, cardX, 602, 124, 58, {
      fill: [1, 1, 1],
      stroke: [0.85, 0.89, 0.94],
      lineWidth: 1,
    });
    addText(commands, card.title.toUpperCase(), cardX + 12, 642, {
      font: 'F2',
      size: 8,
      color: [0.43, 0.50, 0.61],
    });
    wrapText(card.value, 18).slice(0, 2).forEach((line, index) => {
      addText(commands, line, cardX + 12, 624 - (index * 12), {
        font: 'F1',
        size: 11,
        color: [0.16, 0.21, 0.29],
      });
    });
    cardX += 132;
  }

  addRect(commands, 42, 550, 170, 34, { fill: [0.94, 0.97, 0.99] });
  addText(commands, 'STATUS', 54, 570, { font: 'F2', size: 8, color: [0.40, 0.48, 0.59] });
  addText(commands, status.toUpperCase(), 110, 566, { font: 'F2', size: 11, color: statusColor(status) });

  addRect(commands, 226, 550, 170, 34, { fill: [0.97, 0.95, 0.99] });
  addText(commands, 'RECOMMENDATION', 238, 570, { font: 'F2', size: 8, color: [0.40, 0.48, 0.59] });
  addText(commands, recommendation.toUpperCase(), 336, 566, {
    font: 'F2',
    size: 11,
    color: recommendationColor(recommendation),
  });

  addRect(commands, 410, 550, 160, 34, { fill: [0.94, 0.99, 0.96] });
  addText(commands, 'TRUST SCORE', 422, 570, { font: 'F2', size: 8, color: [0.40, 0.48, 0.59] });
  addText(commands, `${sanitize(report.trustScore, '0')} / 100`, 494, 566, {
    font: 'F2',
    size: 11,
    color: [0.10, 0.62, 0.37],
  });

  addDivider(commands, 530);
  addText(commands, 'Verification Details', 42, 510, { font: 'F2', size: 15, color: [0.08, 0.15, 0.27] });
  addText(commands, 'Narrative fields captured from the volunteer submission', 42, 494, {
    font: 'F1',
    size: 10,
    color: [0.39, 0.46, 0.58],
  });

  const leftX = 42;
  const rightX = 312;
  let leftY = 470;
  let rightY = 470;

  const blocks = [
    ['Description', details.description || details.comments || 'No description provided'],
    ['Findings', details.findings || (details.issues || []).join(', ') || 'No findings provided'],
    ['Recommendations', details.recommendations || 'No recommendations provided'],
    ['Verification Status', details.verificationStatus || status],
    ['Photo Reference', details.photoName || 'No photo attached'],
    ['Case Metadata', `Needy ID: ${sanitize(report.needy_id)} | Verified At: ${formatDate(report.verifiedAt)}`],
  ];

  blocks.forEach((block, index) => {
    if (index % 2 === 0) {
      leftY -= addWrappedBlock(commands, block[0], block[1], leftX, leftY, 246);
      leftY -= 14;
    } else {
      rightY -= addWrappedBlock(commands, block[0], block[1], rightX, rightY, 258);
      rightY -= 14;
    }
  });

  addDivider(commands, 72);
  addText(commands, 'Generated by Hravinder Admin Reports', 42, 52, {
    font: 'F1',
    size: 9,
    color: [0.45, 0.50, 0.58],
  });
  addText(commands, 'Confidential: intended for administrative review only', 362, 52, {
    font: 'F1',
    size: 9,
    color: [0.60, 0.27, 0.34],
  });

  return commands.join('\n');
}

function createPdfBuffer(report) {
  const contentStream = buildContentStream(report);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach(object => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += object;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
}

module.exports = {
  createPdfBuffer,
};
