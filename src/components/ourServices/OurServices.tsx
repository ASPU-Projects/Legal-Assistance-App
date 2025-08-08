import React from "react";
import { HeaderSection } from "../headerSection/HeaderSection";
import { useTranslation } from "react-i18next";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';


export default function OurServices() {
  const { t, i18n } = useTranslation();
  return (
    <div className="py-8 container mx-auto">
      <HeaderSection text={t("ourServices")} />
      <div className="services mx-6">
        <div className="service text-center">

          <span>
            <ChatIcon sx={{ fontSize: 60, color: 'var(--clr-product)', mb: "20px" }} />
          </span>
          <h3>{t("contactDirict")}</h3>
          <p className="opacity-75">
            {(t('contactDirict_desc'))}
          </p>
        </div><div className="service text-center">
          <span>
            <PersonAddIcon sx={{ fontSize: 60, color: 'var(--clr-product)', mb: "20px" }} />
          </span>
          <h3>{t("Hiring")}</h3>
          <p className="opacity-75">
            {t('Hiring_desc')}
          </p>
        </div><div className="service text-center">
          <span>
            <HourglassBottomIcon sx={{ fontSize: 60, color: 'var(--clr-product)', mb: "20px" }} />
          </span>
          <h3>{t("track")}</h3>
          <p className="opacity-75">
          {t("track_desc")}
          </p>
        </div>

      </div>
    </div>
  );
}