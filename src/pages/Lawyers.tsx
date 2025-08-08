import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Rating,
  Skeleton,
  Avatar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../helpers/callAPI";
import { RoleTypes } from "../constants/RoleTypes";
import { ILawyer } from "../constants/ILawyer";

export default function LawyersPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState<ILawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track the current page
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true); // To check if more data is available
  const [roleName, setRoleName] = useState<RoleTypes>();
  const [accessToken, setAccessToken] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    setAccessToken(token || '');

    if (role && Object.values(RoleTypes).includes(role as RoleTypes)) {
      setRoleName(role as RoleTypes);
    } else {
      setRoleName(undefined);
    }

    setInitialized(true); // تم تحميل القيم
  }, []);

  // Skeleton
  const HoverAction = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const distanceX = e.clientX - rect.left;
    const distanceY = e.clientY - rect.top;

    target.style.setProperty("--x", `${distanceX}px`);
    target.style.setProperty("--y", `${distanceY}px`);
  };

  const fetchLawyers = async () => {
    if (!accessToken || !roleName || !hasMore) return;

    try {
      setLoading(true);
      const res = await callAPI(roleName, 'lawyers', accessToken, 'GET', null, { page });
      const newLawyers = res?.data || [];
      setLawyers((prev) => [...prev, ...newLawyers]);
      setHasMore(newLawyers.length > 0);
    } catch (error) {
      console.log("Error fetching lawyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const footerHeight = document.querySelector(".footer")?.clientHeight || 0; // احصل على طول الفوتر إذا كان موجودًا
    const scrollOffset = 300; // المسافة الإضافية قبل الوصول للنهاية

    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - footerHeight - scrollOffset
    ) {
      if (hasMore && !loading) {
        setPage((prev) => prev + 1); // تحميل الصفحة التالية
      }
    }
  };

  // Call lawyers
  useEffect(() => {
    if (!initialized || !accessToken || !roleName) return;

    fetchLawyers();
  }, [page, initialized, accessToken, roleName]);

  // For skeleton scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]); // Ensure the listener works correctly

  return (
    <>
      {lawyers && lawyers.length > 0 ? (
        <Box sx={{ padding: 4 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <Grid container spacing={4}>
            {[...lawyers]
              .sort((a, b) => b.rank - a.rank)
              .map((lawyer) => (
                <Grid component={'div'} key={lawyer.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "transform 0.3s",
                      justifyContent: "space-between",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        padding: "0",
                        height: "100%",
                        "&:last-child": {
                          paddingBottom: "0",
                        },
                      }}
                    >
                      <div className="flex h-full items-start justify-between flex-col gap-2 relative specialLawer py-4 px-5">
                        <div className="flex justify-center items-center gap-2 ">
                          <Avatar
                            src={`${import.meta.env.VITE_API_URL_IMAGE}/${lawyer?.avatar}`}
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

                          <div>
                            <h3 className="text-[var(--clr-product)] font-bold">
                              {lawyer?.name}
                            </h3>
                            <h3 className="text-[var(--clr-product)] font-bold">
                              {lawyer?.email}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <span className="font-bold">{t("Description")}: </span>
                          <span className="leading-7">{lawyer?.description}</span>
                        </div>
                        <div>
                          <span className="font-bold">{t("Address")}: </span>
                          <span>{lawyer?.address}</span>
                        </div>
                        <div>
                          <span className="font-bold">{t("yearsOfExperience")}: </span>
                          <span>{lawyer?.years_of_experience} </span>
                          <span>{t("years")}</span>
                        </div>
                        <div>
                          <Rating value={lawyer?.rank} readOnly />{" "}
                        </div>
                        <button
                          type="button"
                          className=" ms-auto ButtonOfLawers rounded-md"
                          onMouseMove={(e) => HoverAction(e)}
                          onClick={() => {
                            navigate(`/lawyers/${lawyer?.id}`);
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>

          {/* هنا نعرض Skeleton فقط إذا في تحميل صفحات لاحقة */}
          {loading && page > 1 && (
            <Box marginTop={4}>
              <Grid container spacing={4}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid component={'div'} key={index}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="50%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      ) : (
        <>
          {/* لا يوجد عناصر */}
          {!loading ? (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#5c7c93",
                marginBottom: "8px",
              }}
            >
              <h2 className="text-center w-full font-bold text-xl">{t('NotFoundData')}</h2>
            </Typography>) : (
            // تحميل الصفحة الأولى (Skeleton كامل)
            <Box sx={{ padding: 4 }}>
              <Grid container spacing={4}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid component={'div'} key={index}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="50%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </>
  );

}
