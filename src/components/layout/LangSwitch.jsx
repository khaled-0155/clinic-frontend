import { Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import flagAr from "../../assets/images/flags/ar.png";
import flagEn from "../../assets/images/flags/en.png";

export default function LangSwitch() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (locale) => {
    i18n.changeLanguage(locale);
  };

  useEffect(() => {
    const currentLang = i18n.language;

    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const languages = [
    {
      value: "en",
      label: (
        <div className="lang-item">
          <img src={flagEn} alt="English" />
          <span>English</span>
        </div>
      ),
    },
    {
      value: "ar",
      label: (
        <div className="lang-item">
          <img src={flagAr} alt="Arabic" />
          <span>العربية</span>
        </div>
      ),
    },
  ];

  return (
    <Select
      variant="borderless"
      value={i18n.language}
      className="lang-selector"
      onChange={handleLanguageChange}
      options={languages}
      dropdownMatchSelectWidth={false}
    />
  );
}
