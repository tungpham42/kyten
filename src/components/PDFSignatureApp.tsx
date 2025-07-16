import React, { useState, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { ResizableBox } from "react-resizable";
import PDFUploader from "./PDFUploader";
import PDFSigner from "./PDFSigner";
import SignaturePad from "./SignaturePad";
import { useLanguage } from "../contexts/LanguageContext";
import "react-resizable/css/styles.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFSignatureApp() {
  const { t } = useLanguage();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [signatureSize, setSignatureSize] = useState({
    width: 100,
    height: 50,
  });
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleFileSelected = (file: File) => {
    setPdfFile(file);
    setPageNumber(1);
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setSignaturePosition({ x: data.x, y: data.y });
  };

  const handleResize = (
    event: any,
    { size }: { size: { width: number; height: number } }
  ) => {
    setSignatureSize({ width: size.width, height: size.height });
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (numPages && pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  return (
    <Container className="my-4">
      <h2>{t("pdf_signature_app")}</h2>

      <PDFUploader onFileSelected={handleFileSelected} />

      <SignaturePad onSave={handleSignatureSave} />

      {pdfFile && (
        <div className="mt-4">
          <div
            ref={canvasRef}
            style={{ position: "relative", display: "inline-block" }}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="border"
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {signatureDataUrl && (
              <Draggable
                onStop={handleDrag}
                defaultPosition={signaturePosition}
                bounds="parent"
              >
                <div style={{ position: "absolute" }}>
                  <ResizableBox
                    width={signatureSize.width}
                    height={signatureSize.height}
                    minConstraints={[50, 25]}
                    maxConstraints={[300, 150]}
                    onResize={handleResize}
                    resizeHandles={["se"]}
                    className="border"
                  >
                    <img
                      src={signatureDataUrl}
                      alt="Signature"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </ResizableBox>
                </div>
              </Draggable>
            )}
          </div>
          {numPages && (
            <div className="mt-2">
              <Button
                variant="secondary"
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
              >
                {t("previous")}
              </Button>{" "}
              <span>
                {t("page")} {pageNumber} {t("of")} {numPages}
              </span>{" "}
              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={pageNumber >= numPages}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </div>
      )}

      {pdfFile && signatureDataUrl && (
        <div className="mt-3">
          <PDFSigner
            pdfFile={pdfFile}
            signatureDataUrl={signatureDataUrl}
            signaturePosition={signaturePosition}
            signatureSize={signatureSize}
          />
        </div>
      )}
    </Container>
  );
}
