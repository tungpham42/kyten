import { Button } from "react-bootstrap";
import { PDFDocument } from "pdf-lib";
import { useLanguage } from "../contexts/LanguageContext";

type Props = {
  pdfFile: File;
  signatureDataUrl: string;
  signaturePosition: { x: number; y: number };
  signatureSize: { width: number; height: number };
};

export default function PDFSigner({
  pdfFile,
  signatureDataUrl,
  signaturePosition,
  signatureSize,
}: Props) {
  const { t } = useLanguage();

  const handleSignPDF = async () => {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const pngImage = await pdfDoc.embedPng(signatureDataUrl);

    firstPage.drawImage(pngImage, {
      x: signaturePosition.x,
      y: firstPage.getHeight() - signaturePosition.y - signatureSize.height,
      width: signatureSize.width,
      height: signatureSize.height,
    });

    const signedPdfBytes = await pdfDoc.save();
    const blob = new Blob([signedPdfBytes], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signed.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="success" onClick={handleSignPDF}>
      {t("sign")}
    </Button>
  );
}
