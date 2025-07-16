import React from "react";
import { Container, Dropdown } from "react-bootstrap";
import PDFSignatureApp from "./components/PDFSignatureApp";
import { useLanguage } from "./contexts/LanguageContext";

function App() {
  const { t, setLanguage } = useLanguage();

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{t("title")}</h2>
        <Dropdown>
          <Dropdown.Toggle variant="secondary">{t("language")}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setLanguage("vi")}>
              Tiếng Việt
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setLanguage("en")}>
              English
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <PDFSignatureApp />
    </Container>
  );
}

export default App;
