const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const { formatDate } = require('../app/utils/helper');
const v8 = require('v8');

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
  doc.fontSize(10).text(`No. Transaksi           : ${trans.transNo}`)
  doc.fontSize(10).text(`Tanggal Pembelian  : ${formatDate(trans.createdAt)}`)
  doc.fontSize(10).text(`Penerima                 : ${trans.recipient}`)
  doc.fontSize(10).text(`Alamat                     : ${trans.address}, ${trans.city}, ${trans.zipCode}`)
  doc.moveDown(2)

  // CEK EFISIENSI FUNGSI PERULANGAN
  const startHeap = v8.getHeapStatistics()
  console.time("Mengitung Waktu")

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

  const endHeap = v8.getHeapStatistics()
  const memoryUsage = endHeap.used_heap_size - startHeap.used_heap_size
  console.log(`Penggunaan memori tambahan: ${memoryUsage} byte`)
  console.timeEnd("Mengitung Waktu")
  // SELESAI CEK EFISIENSI FUNGSI PERULANGAN

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