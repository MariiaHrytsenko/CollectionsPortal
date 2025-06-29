import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Characteristic {
  idcharacteristic: number;
  nameCharacteristic: string;
}

interface Category {
  idcategory: number;
  nameCategory: string;
  characteristics: Characteristic[];
}

export const exportCategoriesToPDF = async (categories: Category[]) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();
  let y = height - 50;

  page.drawText('Categories Export', {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 30;

  for (const category of categories) {
    // Draw category name
    page.drawText(`Category: ${category.nameCategory}`, {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.6),
    });
    y -= 20;
    page.drawText(`ID: ${category.idcategory}`, {
      x: 50,
      y,
      size: 13,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;

    if (category.characteristics.length === 0) {
      page.drawText(`(No characteristics)`, {
        x: 70,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;
    } else {
        page.drawText(`Characteristics:`, {
        x: 70,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;
      for (const char of category.characteristics) {
        page.drawText(`- ${char.nameCharacteristic}`, {
          x: 70,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 18;

        // Prevent overflow – you can add page breaking logic here if needed
        if (y < 50) {
          const newPage = pdfDoc.addPage([600, 800]);
          page.drawText('...continued', { x: 50, y: 30, size: 10, font });
          y = 750;
        }
      }
    }

    y -= 10; // spacing after each category
  }

  const pdfBytes = await pdfDoc.save();

  // Trigger download in browser
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'categories.pdf';
  link.click();
};
