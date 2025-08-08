import React from "react";
import { HeaderSection } from "../headerSection/HeaderSection";
import { useTranslation } from "react-i18next";
import ChatIcon from "@mui/icons-material/Chat";

export default function OurServices() {
  const { t, i18n } = useTranslation();
  return (
    <div className="py-8 container mx-auto">
      <HeaderSection text={t("aboutUs")} />
      <div className="aboutUs mx-6 text-center flex items-center justify-center gap-4">
        <img src="/avatar.jpg" alt="noImage" className="w-1/2 " />
       <p className="text-2xl opacity-60 capitalize">
        {t("legalSystemWho")}
        </p> 
      </div>
    </div>
  );
}
