import React from "react";
import Lawyers from "../components/lawyers/Lawyers";
import MainSection from "../components/mainSection/MainSection";
import OurServices from "../components/ourServices/OurServices";
import WhoAreWe from "../components/WhoAreWe/WhoAreWe";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t, i18n } = useTranslation()

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <MainSection />
      {/* <Lawyers /> */}
      <OurServices />
      <WhoAreWe />
    </div>
  );
}
