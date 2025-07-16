import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "vi" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, Record<string, string>> = {
  vi: {
    title: "Ứng dụng ký tên PDF",
    upload: "Tải lên file PDF",
    clear: "Xóa",
    save: "Lưu chữ ký",
    sign: "Ký & Tải PDF",
    language: "Ngôn ngữ",
  },
  en: {
    title: "PDF Signature App",
    upload: "Upload PDF File",
    clear: "Clear",
    save: "Save Signature",
    sign: "Sign & Download PDF",
    language: "Language",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as Language;
    if (storedLang) setLanguageState(storedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("lang", lang);
    setLanguageState(lang);
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
