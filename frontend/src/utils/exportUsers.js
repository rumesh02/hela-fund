import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatus = (user) => {
  if (user.isBanned) return 'Banned';
  if (user.isVerified) return 'Verified';
  return 'Pending';
};

const toRow = (user) => ({
  Name: user.fullName || user.name || '—',
  Email: user.email || '—',
  Role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—',
  NIC: user.nic || '—',
  'Joined Date': formatDate(user.createdAt),
  Status: getStatus(user),
  University: user.university || '—',
  'Student ID': user.studentId || '—',
  Mobile: user.mobile || '—',
});

export const exportToExcel = (users, filename = 'hela-fund-users') => {
  const rows = users.map(toRow);
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 24 },
    { wch: 30 },
    { wch: 12 },
    { wch: 16 },
    { wch: 14 },
    { wch: 10 },
    { wch: 28 },
    { wch: 16 },
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Users');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (users, filename = 'hela-fund-users') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ── Stats ──────────────────────────────────────────────
  const total = users.length;
  const verified = users.filter((u) => u.isVerified && !u.isBanned).length;
  const pending = users.filter((u) => !u.isVerified && !u.isBanned).length;
  const requesters = users.filter((u) => u.role === 'requester').length;
  const supporters = users.filter((u) => u.role === 'supporter').length;

  // ── Header band ────────────────────────────────────────
  doc.setFillColor(109, 40, 217); // purple-700
  doc.rect(0, 0, pageW, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Hela Fund', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('User Report', 14, 19);

  doc.setFontSize(9);
  doc.text(`Generated: ${now}`, pageW - 14, 19, { align: 'right' });

  // ── Stat boxes ─────────────────────────────────────────
  const stats = [
    { label: 'Total Users', value: total, color: [109, 40, 217] },
    { label: 'Verified', value: verified, color: [22, 163, 74] },
    { label: 'Pending', value: pending, color: [217, 119, 6] },
    { label: 'Requesters', value: requesters, color: [37, 99, 235] },
    { label: 'Supporters', value: supporters, color: [15, 118, 110] },
  ];

  const boxW = (pageW - 28) / stats.length;
  const boxY = 33;

  stats.forEach((s, i) => {
    const x = 14 + i * boxW;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...s.color);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, boxY, boxW - 3, 20, 2, 2, 'FD');

    doc.setFillColor(...s.color);
    doc.roundedRect(x, boxY, 3, 20, 1, 1, 'F');

    doc.setTextColor(...s.color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(String(s.value), x + 8, boxY + 10);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(s.label, x + 8, boxY + 16);
  });

  // ── Section title ──────────────────────────────────────
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('User Details', 14, 62);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, 64, pageW - 14, 64);

  // ── Table ──────────────────────────────────────────────
  const columns = ['Name', 'Email', 'Role', 'NIC', 'Joined Date', 'Status', 'University', 'Student ID', 'Mobile'];
  const rows = users.map((u) => {
    const r = toRow(u);
    return columns.map((c) => r[c]);
  });

  autoTable(doc, {
    startY: 67,
    head: [columns],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [109, 40, 217],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 46 },
      2: { cellWidth: 20 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24 },
      5: { cellWidth: 18 },
      6: { cellWidth: 40 },
      7: { cellWidth: 22 },
      8: { cellWidth: 24 },
    },
    didDrawCell: (data) => {
      // Color-code the Status column (index 5)
      if (data.section === 'body' && data.column.index === 5) {
        const status = data.cell.raw;
        let color = [22, 163, 74]; // green
        if (status === 'Pending') color = [217, 119, 6];
        if (status === 'Banned') color = [220, 38, 38];
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(
          status,
          data.cell.x + data.cell.padding('left'),
          data.cell.y + data.cell.height / 2 + 0.5,
          { baseline: 'middle' }
        );
      }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        data.cell.text = []; // clear default text, drawn in didDrawCell
      }
    },
  });

  // ── Footer ─────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${p} of ${pageCount}`, pageW - 14, doc.internal.pageSize.getHeight() - 6, { align: 'right' });
    doc.text('Hela Fund — Confidential', 14, doc.internal.pageSize.getHeight() - 6);
  }

  doc.save(`${filename}.pdf`);
};
