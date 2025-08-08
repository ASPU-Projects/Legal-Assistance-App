import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Avatar,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { callAPI } from "../helpers/callAPI";
import { RoleTypes } from "../constants/RoleTypes";
import { IRepresentative } from "../constants/IRepresentative";
import { CancelOutlined, CancelTwoTone } from "@mui/icons-material";
import { IAgency } from "../constants/IAgency";

const provinces = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "درعا",
  "السويداء",
  "القنيطرة",
  "إدلب",
  "دير الزور",
  "الرقة",
  "الحسكة",
];

export default function AgencyPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [agency, setAgency] = useState<IAgency>();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);
  const [sequentialNumber, setSequentialNumber] = useState("");
  const [recordNumber, setRecordNumber] = useState("");
  const [placeOfIssue, setPlaceOfIssue] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [representatives, setRepresentatives] = useState<IRepresentative[]>([]);
  const [selectedRepresentative, setSelectedRepresentative] = useState<number>(0);
  const [roleName, setRoleName] = useState<RoleTypes>(RoleTypes.user);
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

  const fetchAgency = async () => {
    if (!accessToken || !roleName) return;
    setLoading(true);

    try {
      const res = await callAPI(roleName, `agencies/${+id}`, accessToken);
      setAgency(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // isolate by user
  const isolateAgency = async () => {
    setHireLoading(true);
    try {
      await callAPI(roleName, `agencies/${+id}/isolate`, accessToken, 'POST')
      setHireLoading(false);
      setDialogOpen(false);

      Swal.fire({
        title: t("agency_isolated_successfully"),
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/agencies");
      });
    } catch (error) {
      setDialogOpen(false);
      setHireLoading(false);
      Swal.fire({
        title: t("failed_to_isolate_agency"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // approve by lawyer & representative
  const approveAgency = async () => {
    setApproveLoading(true);

    const formData = new FormData();
    formData.append("sequential_number", sequentialNumber);
    formData.append("record_number", recordNumber);
    formData.append("place_of_issue", placeOfIssue);

    try {
      roleName == 'lawyer'
        ? await callAPI(roleName, `agencies/${+id}/approved`, accessToken, 'POST', {
          representative_id: selectedRepresentative
        })
        : await callAPI(roleName, `agencies/${+id}/approved`, accessToken, 'POST', {
          formData
        });

      Swal.fire({
        title: t("agency_approved_successfully"),
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: t("failed_to_approve_agency"),
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setApproveLoading(false);
      setOpen(false);
    }
  };

  // rejected by lawyer & representative
  const rejectAgency = async () => {
    setRejectLoading(true);
    try {
      await callAPI(roleName, `agencies/${+id}/rejected`, accessToken, 'POST');

      Swal.fire({
        title: t("agency_rejected_successfully"),
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/agencies");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: t("failed_to_reject_agency"),
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setRejectLoading(false);
    }
  };

  // cancel by user
  const cancelAgency = async () => {
    setCancelLoading(true);
    try {
      await callAPI(roleName, `agencies/${+id}`, accessToken, 'DELETE');

      Swal.fire({
        title: t("agency_canceled_successfully"),
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/agencies");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: t("failed_to_cancel_agency"),
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // جلب بيانات المندوبين
  const fetchRepresentatives = async () => {
    try {
      const response = await callAPI(roleName, 'representatives', accessToken);
      setRepresentatives(response?.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    if (!initialized) return;
    if (!accessToken || !roleName) return;

    fetchAgency();
    fetchRepresentatives();
  }, [initialized, accessToken, roleName]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f4f8"
      p={4}
      sx={{
        backgroundImage: "url(/backBook.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 4,
          boxShadow: 5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#5c7c93",
            color: "#fff",
            p: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${import.meta.env.VITE_API_URL_IMAGE}${agency?.lawyer_avatar}`}
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
            ) : (roleName == 'user'
              ? agency?.lawyer_name?.[0]
              : agency?.user_name?.[0]
            )}
          </Avatar>
          <Typography variant="h5" fontWeight={600}>
            {loading ? (
              <Skeleton width={200} />
            ) : (roleName == 'user'
              ? t("lawyer_name") + `: ${agency?.lawyer_name}`
              : t("client's name") + `: ${agency?.user_name}`
            )}
          </Typography>
        </Box>

        <CardContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
            <Box>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height={30} sx={{ mb: 1 }} />
                ))
              ) : (
                <>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('Record Number')}:</strong> {agency?.record_number}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('sequential_number')}:</strong>{" "}
                    {agency?.sequential_number}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('Status')}:</strong> {t(agency?.status)}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('Place of Issue')}:</strong> {agency?.place_of_issue}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('Type')}:</strong> {t(agency?.type)}
                  </Typography>
                </>
              )}
            </Box>

            <Box>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={30} sx={{ mb: 1 }} />
                ))
              ) : (
                <>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('Authorizations')}:</strong>{" "}
                    <div>
                      {agency?.authorizations?.map((auth, index) => (
                        <span key={index}>
                          {`${t(auth.name)}`}{" "}
                          {index !== agency?.authorizations.length - 1 && ","}{" "}
                        </span>
                      ))}
                    </div>
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    <strong>{t('Exceptions')}:</strong>{" "}
                    <div>
                      {agency?.exceptions?.map((exce, index) => (
                        <span key={index}>
                          {`${t(exce.name)}`}{" "}
                          {index !== agency?.exceptions.length - 1 && ","}{" "}
                        </span>
                      ))}
                    </div>
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
        <Divider />

        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          {roleName === "user" ? (
            <>
              {
                agency?.is_active == 'Yes' && <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<CancelTwoTone />}
                  onClick={() => setDialogOpen(true)}
                  disabled={loading}
                >
                  {t("isolate_agency")}
                </Button>
              }
              {
                agency?.status == 'pending' && <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelOutlined />}
                  onClick={cancelAgency}
                  disabled={cancelLoading}
                >
                  {t("cancel_agency")}
                </Button>
              }
            </>
          ) : (
            agency?.status === "pending" && roleName && (
              <>
                {agency?.status == 'pending' && agency?.lawyer_name && <Button
                  variant="outlined"
                  color="success"
                  onClick={() => setOpen(true)}
                  disabled={approveLoading}
                  startIcon={
                    approveLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  {t("approve_agency")}
                </Button>
                }
                {agency?.status == 'pending' && agency?.lawyer_name && <Button
                  variant="outlined"
                  color="error"
                  onClick={rejectAgency}
                  disabled={rejectLoading}
                  startIcon={
                    rejectLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  {t("reject_agency")}
                </Button>}
              </>
            )
          )}
        </CardActions>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{t("confirm_isolate_agency")}</DialogTitle>
        <DialogContent>
          <Typography>{t("are_you_sure_to_isolate_agency")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={hireLoading}>
            {t("no")}
          </Button>
          <Button
            onClick={isolateAgency}
            variant="contained"
            color="error"
            startIcon={hireLoading ? <CircularProgress size={20} /> : null}
            disabled={hireLoading}
          >
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('Send Notification')}</DialogTitle>
        <DialogContent>
          {roleName === "lawyer" ? (
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('Representative')}</InputLabel>
              <Select
                value={selectedRepresentative}
                onChange={(e) => setSelectedRepresentative(Number(e.target.value))}
                disabled={representatives.length === 0}
                renderValue={(selected) => {
                  const rep = representatives.find((r) => r.id === selected);
                  return rep ? t(rep.name) : '';
                }}>
                {representatives.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <ListItemText primary={t(option.name)} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : roleName === "representative" ? (
            <>
              {/* الرقم التسلسلي */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label={t("Sequential Number")}
                  type="number"
                  value={sequentialNumber}
                  onChange={(e) => setSequentialNumber(e.target.value)}
                />
              </FormControl>

              {/* رقم السجل */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label={t("Record Number")}
                  type="number"
                  value={recordNumber}
                  onChange={(e) => setRecordNumber(e.target.value)}
                />
              </FormControl>

              {/* مكان الإصدار */}
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('Place of Issue')}</InputLabel>
                <Select
                  value={placeOfIssue}
                  onChange={(e) => setPlaceOfIssue(e.target.value)}
                >
                  {provinces.map((province, index) => (
                    <MenuItem key={index} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : <></>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={approveAgency}
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}
