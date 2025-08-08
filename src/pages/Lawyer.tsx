import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Divider,
  Button,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { callAPI } from "../helpers/callAPI";
import { RoleTypes } from "../constants/RoleTypes";
import { ILawyer } from "../constants/ILawyer";
import { IAuthorization } from "../constants/IAuthorization";
import { IException } from "../constants/IException";

export default function LawyerPage() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState<ILawyer>();
  const [authorizations, setAuthorizations] = useState<IAuthorization[]>([]);
  const [exceptions, setExceptions] = useState<IException[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);
  const [agencyType, setAgencyType] = useState("");
  const [cause, setCause] = useState("");
  const [selectedAuthorizations, setSelectedAuthorizations] = useState<number[]>([]);
  const [selectedExceptions, setSelectedExceptions] = useState<number[]>([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [roleName, setRoleName] = useState<RoleTypes>();
  const [accessToken, setAccessToken] = useState('');
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

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

  const fetchLawyer = async () => {
    if (!accessToken || !roleName) return;

    try {
      const res = await callAPI(roleName, `lawyers/${+id}`, accessToken);
      setLawyer(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchAuthorizations = async () => {
    if (!accessToken || !roleName) return;

    try {
      const res = await callAPI(roleName, `authorizations`, accessToken);
      setAuthorizations(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchExceptions = async () => {
    if (!accessToken || !roleName) return;

    try {
      const res = await callAPI(roleName, `exceptions`, accessToken);
      setExceptions(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const agencyLawyer = async () => {
    setHireLoading(true);
    if (cause.length < 3 && agencyType !== 'public') {
      setHireLoading(false);
      return null;
    }

    try {
      agencyType == 'public'
        ? await callAPI(roleName, 'agencies', accessToken, 'POST', {
          lawyer_id: id,
          type: agencyType
        })
        : await callAPI(roleName, 'agencies', accessToken, 'POST', {
          lawyer_id: id,
          type: agencyType,
          cause: cause,
          authorizations: selectedAuthorizations,
          exceptions: selectedExceptions
        });

      setHireLoading(false);
      setDialogOpen(false);
      Swal.fire({
        title: `${t('RequestSentSuccessfully')}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      setHireLoading(false);
      setDialogOpen(false);

      Swal.fire({
        title: `${t('Failed. Please try again')}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const submitRating = async () => {
    if (submitLoading) return; // Prevent submitting if already loading
    setSubmitLoading(true); // Set loading state to true

    try {
      await callAPI(roleName, 'rates', accessToken, 'POST', {
        rating,
        review,
        lawyer_id: id
      });

      setRatingDialogOpen(false);
      Swal.fire({
        title: `${t('RatingSubmittedSuccessfully')}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: `${t('Failed. Please try again')}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitLoading(false); // Reset the loading state
    }
  };

  useEffect(() => {
    if (!initialized) return;
    if (!accessToken || !roleName) return;

    fetchLawyer();
    fetchAuthorizations();
    fetchExceptions();
  }, [initialized, accessToken, roleName]);

  const { t, i18n } = useTranslation();

  return (
    loading
      ? <h2 className="text-center w-full font-bold text-xl">{t('Loading...')}</h2>
      : (
        lawyer
          ? <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            borderRadius={4}
            p={6}
            sx={{
              backgroundImage: "url(/as.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              fontFamily: "Montserrat, sans-serif",
            }}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          >
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={6}
              width="100%"
              maxWidth={800}
              bgcolor="rgba(255, 255, 255, 0.9)"
              borderRadius={4}
              p={6}
            >
              {/* Left Side */}
              <Box>
                {loading ? (
                  <Skeleton
                    variant="circular"
                    width={150}
                    height={150}
                    sx={{ borderRadius: "50%" }}
                  />
                ) : (
                  <Avatar
                    alt="Lawyer"
                    src={lawyer?.avatar}
                    sx={{ width: 150, height: 150, borderRadius: "50%" }}
                  />
                )}

                <Typography variant="h4" component="h2" mt={2} fontWeight={400}>
                  {t('Lawyer')}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  mt={1}
                  color="text.secondary"
                >
                  {lawyer?.phone}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  mt={1}
                  color="text.secondary"
                >
                  {lawyer?.email}
                </Typography>
                {loading ? (
                  <Box
                    sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Skeleton width={200} height={30} />
                    <Skeleton width={120} height={30} />
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      component="p"
                      mt={1}
                      color="text.secondary"
                    >
                      <span>{t('yearsOfExperience')}: </span>
                      {lawyer?.years_of_experience} {t('years')}
                    </Typography>
                    <Rating
                      name="read-only"
                      value={lawyer?.rank}
                      readOnly
                      sx={{ mt: 2, "& .MuiRating-icon": { fontSize: "1.75rem" } }}
                    />
                  </>
                )}
              </Box>

              {/* Right Side */}
              <Box>
                <Typography variant="h3" component="h1" mb={2} fontWeight={600}>
                  {lawyer?.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  {loading ? (
                    <>
                      <Skeleton width={"100%"} height={30} />
                      <Skeleton width={"75%"} height={30} />
                      <Skeleton width={"90%"} height={30} />
                      <Skeleton width={120} height={30} />
                    </>
                  ) : (
                    <Typography variant="body1" component="p" mb={1}>
                      {lawyer?.description}
                    </Typography>
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle1"
                    component="p"
                    color="text.secondary"
                    onClick={() => setRatingDialogOpen(true)}
                  >
                    {t('Rank')}
                  </Typography>
                  {loading ? (
                    <>
                      <Skeleton width={150} height={30} />
                    </>
                  ) : (
                    <Rating
                      name="read-only"
                      value={lawyer?.rank}
                      precision={1}
                      sx={{ "& .MuiRating-icon": { fontSize: "1.75rem" } }}
                      onClick={() => setRatingDialogOpen(true)} // Open dialog on star click
                    />
                  )}
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                >
                  {loading ? (
                    <Skeleton width={150} height={90} sx={{ borderRadius: 2 }} />
                  ) : (
                    <> {
                      roleName == 'user' &&
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CallIcon />}
                          sx={{ minHeight: 50, minWidth: 150 }}
                          onClick={() => navigate(`/conversations`)}
                          className="d-flex gap-2"
                        >
                          {t('ContactWithIt')}
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<PersonAddIcon />}
                          sx={{ minHeight: 50, minWidth: 150 }}
                          onClick={() => setDialogOpen(true)}
                          className="d-flex gap-2"
                        >
                          {t('HireRequest')}
                        </Button>
                      </>
                    }
                    </>
                  )}

                </Box>
              </Box>
            </Box>

            {/* Dialog for Hire */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle>{t('HireRequest')}</DialogTitle>
              <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

                {/* اختيار نوع التوكيل */}
                <FormControl fullWidth>
                  <InputLabel>{t("AgencyType")}</InputLabel>
                  <Select
                    value={agencyType}
                    onChange={(e) => setAgencyType(e.target.value)}
                  >
                    <MenuItem value="">{t("SelectAgencyType")}</MenuItem>
                    <MenuItem value="public">{t("public")}</MenuItem>
                    <MenuItem value="private">{t("private")}</MenuItem>
                    <MenuItem value="legitimacy">{t("legitimacy")}</MenuItem>
                  </Select>
                </FormControl>

                {/* الحقول الإضافية إذا النوع خاص أو شرعي */}
                {agencyType === "private" || agencyType === "legitimacy" ? (
                  <>
                    {/* سبب التوكيل */}
                    <TextField
                      label={t("RequestCause")}
                      fullWidth
                      multiline
                      rows={4}
                      value={cause}
                      onChange={(e) => setCause(e.target.value)}
                      required
                    />

                    {/* التفويضات */}
                    <FormControl fullWidth>
                      <InputLabel>{t("Authorizations")}</InputLabel>
                      <Select
                        multiple
                        value={selectedAuthorizations}
                        onChange={(e) => setSelectedAuthorizations(e.target.value as number[])}
                        disabled={authorizations.length === 0}
                        renderValue={(selected) =>
                          authorizations
                            .filter((auth) => selected.includes(auth.id))
                            .map((auth) => t(auth.name))
                            .join(", ")
                        }                >
                        {authorizations.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={selectedAuthorizations.indexOf(option.id) > -1} />
                            <ListItemText primary={`${t(option.name)}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* الاستثناءات */}
                    <FormControl fullWidth>
                      <InputLabel>{t("Exceptions")}</InputLabel>
                      <Select
                        multiple
                        value={selectedExceptions}
                        onChange={(e) => setSelectedExceptions(e.target.value as number[])}
                        disabled={exceptions.length === 0}
                        renderValue={(selected) =>
                          exceptions
                            .filter((exc) => selected.includes(exc.id))
                            .map((exc) => t(exc.name))
                            .join(", ")
                        }                         >
                        {exceptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={selectedExceptions.indexOf(option.id) > -1} />
                            <ListItemText primary={`${t(option.name)}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : null}

              </DialogContent>

              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>{t('Cancel')}</Button>
                <Button
                  onClick={agencyLawyer}
                  variant="contained"
                  color="secondary"
                  disabled={hireLoading || !agencyType || ((agencyType !== "public") && (!cause || authorizations.length === 0))}
                >
                  {hireLoading ? <CircularProgress size={24} /> : t("RequestSend")}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Dialog for Rating */}
            <Dialog
              open={ratingDialogOpen}
              onClose={() => setRatingDialogOpen(false)}
            >
              <DialogTitle>Rate and Review Lawyer</DialogTitle>
              <DialogContent>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  precision={1}
                />
                <TextField
                  label="Review"
                  fullWidth
                  multiline
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={submitRating}
                  variant="contained"
                  color="primary"
                  disabled={submitLoading || rating === 0 || !review}
                >
                  {submitLoading ? <CircularProgress size={24} /> : "Submit Rating"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          : <h2 className="text-center w-full font-bold text-xl">{t('NotFoundData')}</h2>
      )
  );
}
