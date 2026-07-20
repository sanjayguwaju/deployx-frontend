export const exportToCSV = (data: any[], filename: string, columns?: { key: string, label: string }[]) => {
  if (!data || !data.length) return;

  // Determine headers and access keys
  const headers = columns ? columns.map(col => col.label) : Object.keys(data[0]);
  const keys = columns ? columns.map(col => col.key) : Object.keys(data[0]);

  // Convert array of objects to CSV format
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = keys.map(key => {
      // Handle nested keys e.g., 'user.name'
      const keyParts = key.split('.');
      let val = row;
      for (const part of keyParts) {
        if (val === null || val === undefined) break;
        val = val[part];
      }

      // Escape quotes and commas
      if (val === null || val === undefined) val = '';
      const stringVal = String(val);
      if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    });
    csvRows.push(values.join(','));
  }

  // Combine rows and create blob
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link and trigger
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
