// ===================================
// PDF EXPORT MODULE
// Sophisticated, Colorful PDF Generation
// ===================================

/**
 * Export data to PDF with sophisticated styling
 */
function exportDataToPDF(data, filename = 'data.pdf') {
    if (!data || data.length === 0) {
        showNotification('Tiada data untuk dieksport', 'warning');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

        // Add header
        addPDFHeader(doc, 'Data Pelajar Kokurikulum');

        // Prepare table data
        const columns = ['BIL', 'NAMA', 'JANTINA', 'TINGKATAN', 'KELAS', 'UNIT', 'KELAB', 'SUKAN', 'RUMAH SUKAN'];
        const rows = data.map(row => [
            row.BIL || '-',
            row.NAMA || '-',
            row.JANTINA || '-',
            row.TINGKATAN || '-',
            row.KELAS || '-',
            row.UNIT || '-',
            row['KELAB/PERSATUAN'] || row.KELAB || '-',
            row.SUKAN || '-',
            row.RUMAH_SUKAN || row.RUMAH || '-'
        ]);

        // Add table with colorful styling
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 37,
            theme: 'grid',
            headStyles: {
                fillColor: [102, 126, 234], // Primary purple
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250] // Light gray
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                1: { cellWidth: 50 },
                2: { halign: 'center', cellWidth: 20 },
                3: { halign: 'center', cellWidth: 25 },
                4: { halign: 'center', cellWidth: 30 },
                5: { cellWidth: 40 },
                6: { cellWidth: 40 },
                7: { cellWidth: 35 },
                8: { halign: 'center', cellWidth: 30 }
            },
            didDrawCell: function (data) {
                // Color code Rumah Sukan
                if (data.column.index === 8 && data.section === 'body') {
                    const rumah = data.cell.raw;
                    let color;
                    if (rumah === 'MARIKH') color = [239, 68, 68];        // Red
                    else if (rumah === 'MUSYTARI') color = [59, 130, 246]; // Blue
                    else if (rumah === 'NEPTUNE') color = [234, 179, 8];   // Yellow
                    else if (rumah === 'KEJORA') color = [34, 197, 94];    // Green

                    if (color) {
                        doc.setFillColor(...color);
                        doc.setTextColor(255, 255, 255);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        doc.text(rumah, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                            align: 'center',
                            baseline: 'middle'
                        });
                    }
                }
            },
            margin: { top: 35, left: 10, right: 10 }
        });

        // Add footer
        addPDFFooter(doc, data.length);

        // Save PDF
        doc.save(filename);
        showNotification('PDF berjaya dieksport!', 'success');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showNotification('Ralat mengeksport PDF', 'error');
    }
}

/**
 * Export attendance data to PDF
 */
function exportAttendanceToPDF(data, category, filename = 'kehadiran.pdf') {
    if (!data || data.length === 0) {
        showNotification('Tiada data untuk dieksport', 'warning');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');

        // Add header
        const categoryNames = {
            'kelab': 'Kelab & Persatuan',
            'unit': 'Unit Beruniform',
            'sukan': 'Sukan & Permainan',
            'rumah': 'Rumah Sukan'
        };
        addPDFHeader(doc, `Kehadiran ${categoryNames[category] || category}`);

        // Prepare table data
        const columns = ['NAMA', 'KELAS', 'KATEGORI', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', '%'];
        const rows = data.map(row => {
            const attendance = [];
            let present = 0;
            for (let i = 1; i <= 12; i++) {
                const status = row[`P${i}`] || '';
                attendance.push(status);
                if (status === '✓' || status === 'P' || status === '1') present++;
            }
            const percentage = ((present / 12) * 100).toFixed(0);

            return [
                row.NAMA || '-',
                row.KELAS || '-',
                row.CATEGORY || row.UNIT || row.KELAB || row.SUKAN || row.RUMAH_SUKAN || '-',
                ...attendance,
                `${percentage}%`
            ];
        });

        // Add table
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 37,
            theme: 'grid',
            headStyles: {
                fillColor: getCategoryColor(category),
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 7,
                cellPadding: 2
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { halign: 'center', cellWidth: 20 },
                2: { cellWidth: 35 },
                3: { halign: 'center', cellWidth: 8 },
                4: { halign: 'center', cellWidth: 8 },
                5: { halign: 'center', cellWidth: 8 },
                6: { halign: 'center', cellWidth: 8 },
                7: { halign: 'center', cellWidth: 8 },
                8: { halign: 'center', cellWidth: 8 },
                9: { halign: 'center', cellWidth: 8 },
                10: { halign: 'center', cellWidth: 8 },
                11: { halign: 'center', cellWidth: 8 },
                12: { halign: 'center', cellWidth: 8 },
                13: { halign: 'center', cellWidth: 8 },
                14: { halign: 'center', cellWidth: 8 },
                15: { halign: 'center', cellWidth: 12, fontStyle: 'bold' }
            },
            didDrawCell: function (data) {
                // Color code attendance cells
                if (data.column.index >= 3 && data.column.index <= 14 && data.section === 'body') {
                    const status = data.cell.raw;
                    if (status === '✓' || status === 'P' || status === '1') {
                        doc.setFillColor(34, 197, 94); // Green
                        doc.setTextColor(255, 255, 255);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        doc.text('✓', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                            align: 'center',
                            baseline: 'middle'
                        });
                    } else if (status === '✗' || status === 'A' || status === '0') {
                        doc.setFillColor(239, 68, 68); // Red
                        doc.setTextColor(255, 255, 255);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        doc.text('✗', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                            align: 'center',
                            baseline: 'middle'
                        });
                    } else if (status === 'E') {
                        doc.setFillColor(234, 179, 8); // Yellow
                        doc.setTextColor(255, 255, 255);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        doc.text('E', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                            align: 'center',
                            baseline: 'middle'
                        });
                    }
                }

                // Color code percentage
                if (data.column.index === 15 && data.section === 'body') {
                    const percentage = parseInt(data.cell.raw);
                    if (percentage >= 80) {
                        doc.setTextColor(34, 197, 94); // Green
                    } else if (percentage >= 60) {
                        doc.setTextColor(234, 179, 8); // Yellow
                    } else {
                        doc.setTextColor(239, 68, 68); // Red
                    }
                }
            },
            margin: { top: 35, left: 10, right: 10 }
        });

        // Add footer
        addPDFFooter(doc, data.length);

        // Save PDF
        doc.save(filename);
        showNotification('PDF kehadiran berjaya dieksport!', 'success');
    } catch (error) {
        console.error('Error exporting attendance PDF:', error);
        showNotification('Ralat mengeksport PDF', 'error');
    }
}

/**
 * Add PDF header with gradient effect
 */
function addPDFHeader(doc, title) {
    // Add gradient background (simulated with rectangles)
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 297, 30, 'F');

    // Add school name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('SMK TAMAN LESTARI SERDANG', 148.5, 12, { align: 'center' });

    // Add title
    doc.setFontSize(14);
    doc.text(title, 148.5, 20, { align: 'center' });

    // Add date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const date = new Date().toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Tarikh: ${date}`, 148.5, 26, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
}

/**
 * Add PDF footer
 */
function addPDFFooter(doc, recordCount) {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);

        // Page number
        doc.text(`Halaman ${i} daripada ${pageCount}`, 148.5, 205, { align: 'center' });

        // Record count
        doc.text(`Jumlah Rekod: ${recordCount}`, 15, 205);

        // Generated timestamp
        doc.text(`Dijana: ${new Date().toLocaleString('ms-MY')}`, 282, 205, { align: 'right' });
    }
}

/**
 * Get category color for PDF
 */
function getCategoryColor(category) {
    const colors = {
        'kelab': [118, 75, 162],      // Purple
        'unit': [59, 130, 246],        // Blue
        'sukan': [34, 197, 94],        // Green
        'rumah': [239, 68, 68]         // Red
    };
    return colors[category] || [102, 126, 234];
}
