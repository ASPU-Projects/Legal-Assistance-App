import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function IssuesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}v1/web/by_${localStorage.getItem("role")}/issues?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const newIssues = res?.data?.issues || [];
      setIssues((prev) => [...prev, ...newIssues]);
      setHasMore(newIssues.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const footerHeight = document.querySelector(".footer")?.clientHeight || 0;
    const scrollOffset = 300;

    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - footerHeight - scrollOffset
    ) {
      if (hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <Box sx={{ padding: 4 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {loading ? (
        <Box marginTop={4}>
          <Grid container spacing={4}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
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
      ) : (
        <Grid container spacing={4}>
          {issues.length ? (
            issues.map((issue) => (
              <Grid item xs={12} sm={6} md={4} key={issue?.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {t("base_number")}: {issue?.base_number}
                    </Typography>
                    <Typography variant="body2">
                      {t("record_number")}: {issue?.record_number}
                    </Typography>
                    <Typography variant="body2">
                      {t("agency_record")}: {issue?.agency_record}
                    </Typography>
                    <Typography variant="body2">
                      {t("court_name")}: {issue?.court_name}
                    </Typography>
                    <Typography variant="body2">
                      {t("court_room_name")}: {issue?.court_room_name}
                    </Typography>
                    <Typography variant="body2">
                      {t("start_date")}: {issue?.start_date}
                    </Typography>
                    <Typography variant="body2">
                      {t("end_date")}: {issue?.end_date || t("ongoing")}
                    </Typography>
                    <Typography variant="body2">
                      {t("status")}: {issue?.status}
                    </Typography>
                    <Typography variant="body2">
                      {t("estimated_cost")}: {issue?.estimated_cost}
                    </Typography>
                    <Typography variant="body2">
                      {t("is_active")}: {issue?.is_active}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        marginTop: "auto",
                        background: "linear-gradient(90deg, #5c7c93, #8fa4b9)",
                        color: "#FFF",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        navigate(`/issues/${issue?.id}`);
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      {t("viewDetails")}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "20px",
                background: "linear-gradient(90deg, #f7f9fc, #eef3f7)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                margin: "40px auto",
                maxWidth: "600px",
                textAlign: "center",
              }}
            >
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
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
}
