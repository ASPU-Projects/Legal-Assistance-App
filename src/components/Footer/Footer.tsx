import { useTranslation } from "react-i18next";
import { Facebook, Twitter, LinkedIn, Instagram, LocationCity, Phone, Email } from "@mui/icons-material"; // Icons for social media

export default function FooterComponent() {
  const { t, i18n } = useTranslation();

  return (
    <footer dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="bg-[var(--clr-product)] py-5 text-white footer bottom-0">
      <div className="container mx-auto px-6">
        {/* Footer Top Section */}
        <div className="flex flex-col md:flex-row justify-around mb-12 px-10">
          {/* Contact Information */}
          <div className="flex items-center mx-auto md:items-start w-1/2">
            <div className="flex flex-col gap-5 flex-wrap">
              <div className="flex gap-3 ">
                <LocationCity sx={{ fontSize: "50" }} />
                <h3>{t('Syria - Damascus - AlMazzeh')}</h3>
              </div>

              <div className="flex gap-3 ">
                <Phone sx={{ fontSize: "50" }} />
                <a
                  href="tel:+1234567890"
                  className="flex items-center text-xl hover:text-gray-300"
                  title={t("Call Us")}
                >
                  +963 996 450 878
                </a>
              </div>

              <div className="flex gap-3 ">
                <Email sx={{ fontSize: "50" }} />
                <a
                  href="mailto:np-reply@legal.org"
                  className="flex items-center text-xl hover:text-gray-300"
                  title={t("Email Us")}
                >
                  legal.assistante2025@gmail.org
                </a>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <h4 className="text-xl font-bold mb-4">{t("About the company")}</h4>
            <h5 className="text-xl mb-4">
              {t("We offer a variety of services designed specifically to meet the needs of our clients and help them make decisions to choose the most suitable lawyer to solve their problems. We always strive to understand market demands and respond to challenges in the best possible ways.")}
            </h5>
            <ul className="flex gap-10">
              <li>
                <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook fontSize="large" />
                </a>
              </li>
              <li>
                <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram fontSize="large" />
                </a>
              </li>
              <li>
                <a href="http://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter fontSize="large" />
                </a>
              </li>
              <li>
                <a href="http://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <LinkedIn fontSize="large" />
                </a>
              </li>
            </ul>

          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-600 pt-6 text-center">
          <p className="text-sm mb-2">
            &copy; {new Date().getFullYear()} {t("companyName")}. {t("allRightsReserved")}
          </p>
          <p className="text-sm text-gray-400">
            {t("Syria - Damascus - AlMazzeh")}
          </p>
        </div>
      </div>
    </footer>
  );
}
