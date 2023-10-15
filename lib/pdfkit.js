const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const formatDate = require('./formatDate');

const setCurrency = number => {
  return Number(number).toLocaleString('id-ID')
}

// Fungsi untuk menghasilkan PDF dengan daftar item
function generateInvoice(produts, user, trans) {
  const doc = new PDFDocument();

  // Tambahkan konten ke PDF
  doc.fontSize(14).text('Invoice Pembelian', { align: 'center' });
  doc.fontSize(12).text('Alkeshop', { align: 'center' });

  // Data item yang dibeli
  const items = produts;

  // Data user
  doc.moveDown()
  doc.fontSize(10).text(`Sdr/i. ${user.fullName}`)
  doc.fontSize(10).text(`Email                       : ${user.email}`)
  doc.fontSize(10).text(`Alamat                     : ${user.address}`)
  doc.fontSize(10).text(`No. Transaksi           : ${trans.transNo}`)
  doc.fontSize(10).text(`Tanggal Pembelian  : ${formatDate(trans.createdAt)}`)
  doc.moveDown(2)

  // Mengisi data item ke dalam tabel
  const tableRows = [];
  let totalAmount = 0;
  items.forEach(item => {
    const itemName = item.Product.productName;
    const itemPrice = item.Product.price;
    const itemQty = item.quantity;
    const totalItemAmount = itemPrice * itemQty;
    totalAmount += totalItemAmount;

    tableRows.push([
      itemName,
      `Rp${setCurrency(itemPrice)}`,
      itemQty,
      `Rp${setCurrency(totalItemAmount)}`
    ]);
  });

  const table = {
    headers: [
      { label: 'Nama Item', headerAlign: 'center', valign: 'center', width: 200 },
      { label: 'Harga Satuan', align: 'center', valign: 'center', width: 90 },
      { label: 'Jumlah', align: 'center', valign: 'center', width: 90 },
      { label: 'Total', align: 'center', valign: 'center', width: 90 }
    ],
    rows: tableRows,
  };

  // Menggambar tabel
  doc.table(table, {
    // columnsSize: [200, 100, 50, 100],
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
    prepareRow: () => {
      doc.font("Helvetica").fontSize(10);
    }
  });

  // Tambahkan total akhir
  doc.fontSize(11).text(`Total: Rp${setCurrency(totalAmount)}`, { align: 'right' });

  return doc;
}

module.exports = generateInvoice