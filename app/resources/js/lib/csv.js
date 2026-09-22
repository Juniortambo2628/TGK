export function exportCSV(rows, filename) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object');
    const csvContent = [
        headers.join(','),
        ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
