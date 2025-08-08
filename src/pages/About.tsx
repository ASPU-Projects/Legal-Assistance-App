import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="text-center pt-10 px-10 pb-14" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl text-[var(--clr-product)] font-bold mb-2 ">{t('About Us')}</h1>
      <p className="mb-2 opacity-75">
        {t('Welcome to the Legal Assistant, where we combine expertise and passion to achieve excellence. We are a distinguished team striving to provide innovative solutions in the field of information technology, committed to delivering the highest levels of quality and service to our clients.')}
      </p>
      <p className="opacity-75">
        {t("We work diligently to meet our clients' needs and achieve their complete satisfaction. We believe that innovation and continuous development are the keys to success in today's world, and we strive to adopt the latest technologies and best practices in delivering our services.")}
      </p>
      <hr className=" border-t-1 border-t-[var(--clr-product)] my-6" />
      <h2 className="text-2xl text-[var(--clr-product)] font-bold mb-2 ">{t('Our Vision')}</h2>
      <p className="opacity-75">
        {t('To become leaders in the fields of AI & software engineering relying on excellence and quality in everything we deliver.')}
      </p>
      <hr className=" border-t-1 border-t-[var(--clr-product)] my-6" />

      <h2 className="text-2xl text-[var(--clr-product)] font-bold mb-2 ">{t('Our Mission')}</h2>
      <p className="opacity-75">
        {t("To provide outstanding and reliable services that meet our clients' aspirations, focusing on innovation and continuous development.")}
      </p>
      <hr className=" border-t-1 border-t-[var(--clr-product)] my-6" />

      <h2 className="text-2xl text-[var(--clr-product)] font-bold mb-2 ">{t('Our Values')}</h2>
      <ul>
        <li>
          <span className="font-bold text-[var(--clr-product)] underline">{t('Quality')}:</span>{" "}
          {t('We offer the best products and services to ensure customer satisfaction.')}
        </li>
        <li>
          <span className="font-bold text-[var(--clr-product)] underline">
            {t('Innovation')}:
          </span>{" "}
          {t('We adopt the latest technologies and solutions to add value for our clients.')}
        </li>
        <li>
          <span className="font-bold text-[var(--clr-product)] underline">
            {t('Integrity')}:
          </span>{" "}
          {t('We believe in the importance of honesty and transparency in all our dealings.')}
        </li>
        <li>
          <span className="font-bold text-[var(--clr-product)] underline">{t('Teamwork')}:</span>{" "}
          {t('We work together as a team to achieve our common goals.')}
        </li>
      </ul>
      <hr className=" border-t-1 border-t-[var(--clr-product)] my-6" />

      <h2 className="text-2xl text-[var(--clr-product)] font-bold mb-2 ">{t('What We Offer')}</h2>
      <p className="opacity-75">
        {t("We offer a variety of services designed specifically to meet the needs of our clients and help them make decisions to choose the most suitable lawyer to solve their problems. We always strive to understand market demands and respond to challenges in the best possible ways.")}
      </p>
    </div>
  );
}
