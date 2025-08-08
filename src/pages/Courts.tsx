import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function CourtsPage() {
  const { t, i18n } = useTranslation();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}v1/public/courts?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const newCourts = res?.data?.courts || [];
      setCourts((prev) => [...prev, ...newCourts]);
      setHasMore(newCourts.length > 0);
    } catch (error) {
      console.error("Error fetching courts:", error);
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
    fetchCourts();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <Box sx={{ padding: 4 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {loading && page === 1 ? (
        <Grid container spacing={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
      ) : (
        <Grid container spacing={4}>
          {courts.length ? (
            courts.map((court) => (
              <Grid item xs={12} sm={6} md={4} key={court.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      backgroundImage:
                        "linear-gradient(90deg, #5c7c93, #8fa4b9)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {court.name}
                    </Typography>
                  </Box>
                  <CardContent
                    sx={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {t("court_name")}: {court.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                      }}
                    >
                      {t("rooms")}:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {court.rooms.map((room) => (
                        <Typography
                          key={room.id}
                          sx={{
                            padding: "6px 12px",
                            backgroundColor: "#f0f4f8",
                            borderRadius: "12px",
                            fontSize: "0.9rem",
                            color: "#555",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {room.name}
                        </Typography>
                      ))}
                    </Box>
                    {/*             
                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(90deg, #5c7c93, #8fa4b9)",
                        color: "#FFF",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        borderRadius: "10px",
                      }}
                      onClick={() => {
                        navigate(`/courts/${court.id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {t("viewCourtDetails")}
                    </Button>
                    <Box
                      sx={{
                        minWidth: "120px",
                        textAlign: "right",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: "#888",
                        }}
                      >
                        {t("court_status")}:
                      </Typography>
                      <select
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          marginTop: "4px",
                          backgroundColor: "#fff",
                          fontSize: "0.9rem",
                          color: "#333",
                        }}
                      >
                        <option value="active">{t("active")}</option>
                        <option value="inactive">{t("inactive")}</option>
                        <option value="maintenance">{t("maintenance")}</option>
                      </select>
                    </Box>
                  </Box> */}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#5c7c93",
                marginBottom: "8px",
                textAlign: 'center'
              }}
            >
              <h2 className="text-center w-full font-bold text-xl">{t('NotFoundData')}</h2>
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
}
