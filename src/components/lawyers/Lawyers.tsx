import "swiper/css";
import "swiper/css/pagination";
import Rating from "@mui/material/Rating";
import { Pagination } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ILawyer } from "../../constants/ILawyer";
import { HeaderSection } from "../headerSection/HeaderSection";
import { Avatar, Skeleton } from "@mui/material";
import { callAPI } from "../../helpers/callAPI";

const ReviewSection = () => {
  const [lawyers, setLawyers] = useState<ILawyer[]>([]);
  const [roleName, setRoleName] = useState<any>("");
  const [accessToken, setAccessToken] = useState<any>("");
  const navigate = useNavigate();

  const HoverAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect(); // للحصول على موقع وحجم العنصر
    const distanceX: number = e.clientX - rect.left; // إحداثيات X بالنسبة إلى العنصر
    const distanceY: number = e.clientY - rect.top; // إحداثيات Y بالنسبة إلى العنصر
    target.style.setProperty("--x", `${distanceX}px`);
    target.style.setProperty("--y", `${distanceY}px`);
  };

  const fetchLawyers = async () => {
    try {
      const response = await callAPI(roleName, 'lawyers', accessToken)

      setLawyers(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
    setRoleName(localStorage.getItem("role"));
    fetchLawyers();
  }, []);

  return (
    lawyers && lawyers?.length && <div className="py-8 container mx-auto">
      <HeaderSection text={t("review")} />
      <Swiper
        slidesPerView={3} // عدد الشرائح الافتراضي
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 2, // 1 شريحة للشاشات الصغيرة
          },
          768: {
            slidesPerView: 2, // 2 شريحة للشاشات المتوسطة
          },
          1024: {
            slidesPerView: 2, // 3 شرائح للشاشات الكبيرة
          },
        }}
      >

        {lawyers && lawyers.length > 0 && lawyers.map((lawyer) =>
          <SwiperSlide>
            <div className="flex items-start justify-start flex-col gap-2 relative specialLawer py-4 px-5">
              <div className="flex justify-center items-center gap-2 ">
                <Avatar
                  src={`${import.meta.env.VITE_API_URL_IMAGE}${lawyer?.avatar}`}
                  sx={{
                    bgcolor: "#fff",
                    color: "#5c7c93",
                    mr: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  {loading ? (
                    <Skeleton variant="circular" width={56} height={56} />
                  ) : (
                    lawyer?.name?.[0]
                  )}
                </Avatar>
                <h3 className="text-[var(--clr-product)] font-bold">
                  {`${lawyer.name}`}
                </h3>
              </div>
              <p className=" leading-7">
                {`${lawyer.description}`}
              </p>
              <div>
                <span className="font-bold">{t("union")} :</span>
                <span>
                  {`${lawyer.union_branch}`}
                </span>
              </div>
              <div>
                <span className="font-bold">{t("yearsOfExperience")}: </span>
                <span>{lawyer?.years_of_experience} </span>
                <span>{t("years")}</span>
              </div>
              <div>
                <Rating value={lawyer.rank} readOnly />{" "}
              </div>
              <button
                type="button"
                className=" ms-auto ButtonOfLawers rounded-md"
                onMouseMove={(e) => HoverAction(e)}
                onClick={() => {
                  navigate(`/lawyers/${lawyer.id}`);
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  });
                }}
              >
                {t("pageOfLawer")}
              </button>
            </div>
          </SwiperSlide>
        )}

      </Swiper>
    </div>
  );
};

export default ReviewSection;
