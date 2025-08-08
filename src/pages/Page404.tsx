import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  return (
    <div
      className="h-screen capitalize"
      style={{
        width: "100%",
        // height: "100%",
        backgroundColor: "var(--clr-product)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "80px",
      }}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      404 😢
      <p className="text-center text-capitalize">{t("404")}</p>
    </div>
  );
}
