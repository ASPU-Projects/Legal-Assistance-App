import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination, Keyboard, Autoplay } from "swiper/modules"; // Import Autoplay module
import { Typewriter } from "react-simple-typewriter";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SliderKeyboardControl() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperKey, setSwiperKey] = useState(0);
  const [roleName] = useState<any>(localStorage.getItem('role'));
  const navigate = useNavigate();

  // إعادة تهيئة السوايبر عند تغيير اللغة
  useEffect(() => {
    setSwiperKey(prevKey => prevKey + 1);
  }, [i18n.language]);

  return (
    <Swiper
      // spaceBetween={5}
      key={`swiper-${swiperKey}`} // هذا سيجبر إعادة إنشاء المكون عند التغيير
      loop={true} // Enable infinite loop
      keyboard={{ enabled: true }} // Enable keyboard control
      navigation={true}
      autoplay={{
        delay: 10000, // Set autoplay delay to 10 seconds
        disableOnInteraction: false, // Continue autoplay after user interaction
      }}
      pagination={{
        clickable: true,
        el: ".custom-pagination",
      }}
      modules={[Pagination, Keyboard, Autoplay]} // Include the Autoplay module
      className="mySwiperKeyboard"
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // Track active slide
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <SwiperSlide className="sliderFade text-white">
        <div className="flex items-center justify-between container mx-auto">
          <div className="infoSlide w-[50%] mx-5">
            <h2 className="capitalize text-4xl text-white my-4 font-bold">
              {t('legalAssistant')}
            </h2>
            <p className="capitalize text-2xl opacity-75">
              {activeIndex === 0 && (
                <Typewriter
                  words={[t("ourMessage")]}
                  loop={Infinity}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              )}
            </p>
          </div>
          {
            roleName == 'user'
              ? <div className="mx-5 flex-1 text-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: "100%", fontSize: "18px" }}
                  onClick={() => navigate('/lawyers')}
                >
                  {t('findYour')}
                </Button>
              </div>
              : <></>
          }
        </div>
      </SwiperSlide>
      <SwiperSlide className="sliderFade text-white">
        <div className="flex items-center justify-between container mx-auto">
          <div className="infoSlide w-[50%] mx-5">
            <h2 className="capitalize text-4xl text-white my-4 font-bold">
              {t('legalAssistant')}
            </h2>
            <p className="capitalize text-2xl opacity-75">
              {activeIndex === 1 && (
                <Typewriter
                  words={[t("weWork")]}
                  loop={Infinity}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              )}
            </p>
          </div>
          {
            roleName == 'user'
              ? <div className="mx-5 flex-1 text-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: "100%", fontSize: "18px" }}
                  onClick={() => navigate('/lawyers')}
                >
                  {t('findYour')}
                </Button>
              </div>
              : <></>
          }
        </div>
      </SwiperSlide>
      <SwiperSlide className="sliderFade text-white">
        <div className="flex items-center justify-between container mx-auto">
          <div className="infoSlide w-[50%] mx-5">
            <h2 className="capitalize text-4xl text-white my-4 font-bold">
              {t('legalAssistant')}
            </h2>
            <p className="capitalize text-2xl opacity-75">
              {activeIndex === 2 && (
                <Typewriter
                  words={[t("ourView")]}
                  loop={Infinity}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              )}
            </p>
          </div>
          {
            roleName == 'user'
              ? <div className="mx-5 flex-1 text-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: "100%", fontSize: "18px" }}
                  onClick={() => navigate('/lawyers')}
                >
                  {t('findYour')}
                </Button>
              </div>
              : <></>
          }
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
