import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
  CardMedia,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../helpers/callAPI";
import { RoleTypes } from "../constants/RoleTypes";
import { IAgency } from "../constants/IAgency";

export default function AgenciesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<IAgency[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
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

  const fetchAgencies = async () => {
    if (!accessToken || !roleName || !hasMore) return;

    try {
      setLoading(true);
      const res = await callAPI(roleName, 'agencies', accessToken, 'GET', null, { page });
      const newAgencies = res?.data || [];
      setAgencies((prev) => [...prev, ...newAgencies]);
      setHasMore(newAgencies.length === pageSize);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollOffset = 300;
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - scrollOffset
    ) {
      if (hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (!initialized || !accessToken || !roleName) return;

    fetchAgencies();
  }, [page, initialized, accessToken, roleName]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <>
      {agencies && agencies.length > 0 ? (
        <Box sx={{ padding: 4 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <Grid container spacing={4}>
            {[...agencies]
              .map((agency) => (
                <Grid component={'div'} key={agency.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                      }}
                    >
                    </Box>
                    <CardContent
                      sx={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {
                        roleName == 'user'
                          ? <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {t("LawyerName")}: {agency.lawyer_name}
                          </Typography>
                          : <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {t("client's name")}: {agency.user_name}
                          </Typography>
                      }
                      <Typography variant="body2">
                        {t("AgencyType")}: {t(agency.type)}
                      </Typography>
                      <Typography variant="body2">
                        {t("PlaceOfIssue")}: {agency.place_of_issue}
                      </Typography>
                      <Typography variant="body2">
                        {t("RecordNumber")}: {agency.record_number}
                      </Typography>
                      <Typography variant="body2">
                        {t("Status")}: {t(agency.status)}
                      </Typography>
                      <Typography variant="body2">
                        {t("IsActive")}: {agency.is_active === 'Yes' ? 'نعم' : 'لا'}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          mt: "auto",
                          background: "linear-gradient(90deg, #5c7c93, #8fa4b9)",
                          color: "#FFF",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          borderRadius: "8px",
                        }}
                        onClick={() => {
                          navigate(`/agencies/${agency.id}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {t("AgencyInfo")}
                      </Button>
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
