import React from "react";
import { Form } from "react-bootstrap";
import { useLanguage } from "../contexts/LanguageContext";

type Props = {
  onFileSelected: (file: File) => void;
};

export default function PDFUploader({ onFileSelected }: Props) {
  const { t } = useLanguage();

  return (
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Label>{t("upload")}</Form.Label>
      <Form.Control
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </Form.Group>
  );
}
