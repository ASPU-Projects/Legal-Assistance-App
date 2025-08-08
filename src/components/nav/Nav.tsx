import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Popover,
  MenuItem,
  CircularProgress,
  Button,
  Drawer,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { logoutUser } from "../../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Pusher from "pusher-js";
import LanguageDropdown from "./LanguageDropdown";
import { useTranslation } from "react-i18next";
import { callAPI } from "../../helpers/callAPI";

export default function NavBarComponent() {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [loadingSignOut, setLoadingSignOut] = useState<any>(false);
  const [loadingDelete, setLoadingDelete] = useState<any>(false);
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [dialogOpen, setDialogOpen] = useState<any>(false);
  const [currentPassword, setCurrentPassword] = useState<any>("");
  const [newPassword, setNewPassword] = useState<any>("");
  const [confirmPassword, setConfirmPassword] = useState<any>("");
  const [loadingChange, setLoadingChange] = useState<any>(false);
  const [loadProfile, setLoadProfile] = useState<any>(false);
  const [profileData, setProfileData] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<any>(null);
  const [notifications, setNotifications] = useState<any>([]);
  const [loadingNotifications, setLoadingNotifications] = useState<any>(false);
  const [accessToken] = useState<any>(localStorage.getItem("access_token"));
  const [roleName] = useState<any>(localStorage.getItem("role"));

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dataNotification, setDataNotification] = useState<any>({});
  const audioRef = useRef<any>(null);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err: any) => {
        console.error("Error playing audio:", err);
      });
    }
  };

  useEffect(() => {
    // إعداد Pusher
    let pusher = new Pusher("7e221c9a276e6d97951f", {
      cluster: "mt1",
      forceTLS: true,
      // إضافة الـ token للتوثيق (إذا كنت بحاجة إليه)
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // التحقق من الاتصال بـ Pusher
    pusher.connection.bind("connected", () => {
      console.log("Connected to Pusher!");
    });

    pusher.connection.bind("error", (err: any) => {
      console.error("Pusher connection error:", err);
    });

    pusher
      .subscribe(`lawyer_notifications_${profileData?.id}`)
      .bind("send.notification.from.user.to.lawyer", (data) => {
        playNotificationSound();
        setDataNotification(data);
        setSnackbarOpen(true);
        const newMessageObj = {
          agency_id: data.id,
          msg: data.body,
        };

        setNotifications((prevMessages) => [...prevMessages, newMessageObj]);
      });

    pusher
      .subscribe(`representative_notifications_${profileData?.id}`)
      .bind("send.notification.from.representative.to.lawyer", (data) => {
        playNotificationSound();

        setDataNotification(data);
        setSnackbarOpen(true);
        const newMessageObj = {
          agency_id: data.id,
          msg: data.body,
        };

        setNotifications((prevMessages) => [...prevMessages, newMessageObj]);
      });

    pusher
      .subscribe(`user_notifications_${profileData?.id}`)
      .bind("send.notification.from.lawyer.to.user", (data) => {
        playNotificationSound();

        setDataNotification(data);
        setSnackbarOpen(true);
        const newMessageObj = {
          agency_id: data.id,
          msg: data.body,
        };

        setNotifications((prevMessages: any) => [
          ...prevMessages,
          newMessageObj,
        ]);
      });

    pusher
      .subscribe(`user_notifications_${profileData?.id}`)
      .bind("send.notification.from.representative.to.user", (data) => {
        playNotificationSound();

        setDataNotification(data);
        setSnackbarOpen(true);
        const newMessageObj = {
          agency_id: data.id,
          msg: data.body,
        };

        setNotifications((prevMessages) => [...prevMessages, newMessageObj]);
      });

    pusher
      .subscribe(`representative_notifications_${profileData?.id}`)
      .bind("send.notification.from.lawyer.to.representative'", (data) => {
        playNotificationSound();

        setDataNotification(data);
        setSnackbarOpen(true);
        const newMessageObj = {
          agency_id: data.id,
          msg: data.body,
        };

        setNotifications((prevMessages) => [...prevMessages, newMessageObj]);
        // alert(`New message: ${data}`); // يمكن إضافة رسالة منبثقة للاختبار
      });
    // }

    // تنظيف عند مغادرة المكون
    return () => {
      pusher.unsubscribe("message.sent");
      pusher.unsubscribe("conversation_77");
      pusher.unsubscribe("send.notification.from.user.to.lawyer");
      pusher.unsubscribe("send.notification.from.representative.to.lawyer");
      pusher.unsubscribe("send.notification.from.representative.to.user");
      pusher.unsubscribe("send.notification.from.lawyer.to.representative");
      pusher.unsubscribe("send.notification.from.lawyer.to.user");
    };
  }, [profileData]);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = async () => {
    setLoadingSignOut(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL_AUTH}/logout`,
        {
          role: roleName || "user",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(logoutUser());
      localStorage.removeItem("access_token");
      localStorage.removeItem("authenticate");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 401) {
        dispatch(logoutUser());
        localStorage.removeItem("access_token");
        localStorage.removeItem("authenticate");
        localStorage.removeItem("role");
        navigate("/login");
        navigate("/login");
      }
    } finally {
      setLoadingSignOut(false);
    }
  };

  const handleChangePassword = async () => {
    setLoadingChange(true);
    try {
      const response = await callAPI('user', 'profile/change-password', accessToken, 'POST', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })

      setProfileData(response.data)
      setDrawerOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChange(false);
    }
  };

  const fetchProfile = async () => {
    setLoadProfile(true);
    try {
      const response = await callAPI(roleName, 'profile', accessToken);
      setProfileData(response?.data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(logoutUser());
        localStorage.removeItem("access_token");
        localStorage.removeItem("authenticate");
        localStorage.removeItem("role");
        navigate("/login");
        navigate("/login");
      }
    } finally {
      setLoadProfile(false);
    }
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await callAPI(roleName, 'notifications', accessToken);
      setNotifications(response?.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  const deleteAccount = async () => {
    setLoadingDelete(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL_USER}/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(logoutUser());
      localStorage.removeItem("access_token");
      localStorage.removeItem("authenticate");
      localStorage.removeItem("role");
      navigate("/logup");
    } catch (error) {
      console.log("Error deleting account:", error);
    } finally {
      setLoadingDelete(false);
      setDialogOpen(false);
    }
  };

  // States for Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [formDataContainer, setFormDataContainer] = useState({
    name: "",
    address: "",
    birthday: "",
    birth_place: "",
    phone: "",
    imageUpload: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataContainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormDataContainer((prev) => ({ ...prev, imageUpload: file }));
      setPreviewImage(URL.createObjectURL(file)); // عرض الصورة قبل الرفع
    }
  };

  const changeInfo = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formDataContainer.name || "");
    formDataToSend.append("address", formDataContainer.address || "");
    formDataToSend.append("birth_place", formDataContainer.birth_place || "");
    formDataToSend.append("phone", formDataContainer.phone || "");
    if (formDataContainer.imageUpload) {
      formDataToSend.append("avatar", formDataContainer.imageUpload);
    }

    try {
      let url = "";
      if (roleName === "user") {
        url = `${import.meta.env.VITE_API_URL_USER}/update-profile`;
      } else if (roleName === "lawyer") {
        url = `${import.meta.env.VITE_API_URL_LAWYER}/lawyers/${profileData?.id}`;
      } else {
        url = `${import.meta.env.VITE_API_URL_REPRESENTATIVE}/representatives/${profileData?.id}`;
      }

      setUploadProgress(0); // بدء التحميل

      const res = await axios.post(url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      setProfileData(res?.data?.data);
      setOpenDialog(false); // Close dialog after successful submission
      setUploadProgress(null); // إخفاء التحميل
    } catch (error) {
      console.error("Error updating info:", error);
      setOpenDialog(false); // Close dialog after successful submission
      setUploadProgress(null); // إخفاء التحميل
    }
  };

  const navItems = useMemo(() => [
    roleName !== 'user' && { id: 'Lawyers', path: 'lawyers', roles: ['user', 'lawyer', 'representative'] },
    { id: 'Agencies', path: 'agencies', roles: ['user', 'lawyer', 'representative'] },
    { id: 'Issues', path: 'issues', roles: ['user', 'lawyer'] },
    { id: 'Courts', path: 'courts', roles: ['lawyer', 'representative'] },
    { id: 'About', path: 'about', roles: ['user', 'lawyer', 'representative'] }
  ].filter(Boolean), [roleName]);


  return (
    <Box sx={{ flexGrow: 1 }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <audio ref={audioRef} src="/message.mp3" />
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1d4c6a, #8faabf)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
            <Typography
              variant="h5"
              onClick={() => navigate('/')}
              sx={{ fontWeight: "bold", color: "#ffffff", cursor: "pointer" }}
            >
              {t('legalAssistant')}
            </Typography>

          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 3 }}>
            {navItems.map(
              (item) => {
                const userRole = roleName || 'user';
                if (!item.roles.includes(userRole)) return null;
                return (
                  <Link
                    key={item.id}
                    to={`/${item.path}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      sx={{
                        color: "#ffffff",
                        textTransform: "none",
                        fontWeight: "500",
                        "&:hover": {
                          color: "#fff",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      {t(item.id)}
                    </Button>
                  </Link>
                );
              }
            )}
          </Box>

          <LanguageDropdown />

          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{ position: "relative" }}
          >
            <NotificationsIcon />
            {notifications.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
            )}
          </IconButton>

          <Popover
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "10px",
                minWidth: "300px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Box sx={{ padding: 2 }}>
              {loadingNotifications ? (
                <CircularProgress size={20} />
              ) : notifications?.length > 0 ? (
                <List>
                  {notifications?.map((notification, index) => (
                    <ListItem
                      key={index}
                      divider
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#1d4c6a8a", // لون الخلفية عند التمرير
                          color: "#fff",
                          transform: "scale(1.02)", // تكبير بسيط عند التمرير
                        },
                        "&:active": {
                          backgroundColor: "#1d4c6a",
                          color: "#fff", // لون الخلفية عند النقر
                          transform: "scale(0.98)", // تصغير بسيط عند النقر
                        },
                      }}
                      onClick={() => {
                        navigate(`/agencies/${notification?.agency_id}`);
                      }}
                    >
                      {index + 1}
                      {"  "} :{" "}
                      <ListItemText
                        primary={`${notification?.title}:${notification?.body}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: "gray", textAlign: "center" }}
                >
                  {t('NotFoundNotifications')}
                </Typography>
              )}
            </Box>
          </Popover>
          <IconButton onClick={handleProfileClick}>
            <Avatar
              alt="User Profile"
              src={`${import.meta.env.VITE_API_URL_IMAGE}${profileData?.avatar}`}
              sx={{ border: "2px solid #ffffff" }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            padding: "10px",
            minWidth: "200px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <MenuItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            textAlign: "center",
          }}
        >
          {loadProfile ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {profileData?.name || t("Guest")}
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                {profileData?.email || t("NoEmailAvailable")}
              </Typography>
            </>
          )}
        </MenuItem>
        {
          roleName == 'user'
            ? <MenuItem
              onClick={() => setDrawerOpen(true)}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {t('ChangePassword')}
            </MenuItem>
            : <></>
        }
        <MenuItem
          onClick={() => setOpenDialog(true)}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {t('ChangeInfo')}
        </MenuItem>
        <MenuItem>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={logOut}
            disabled={loadingSignOut}
            sx={{ textTransform: "none", fontWeight: "500" }}
          >
            {loadingSignOut && <CircularProgress size={20} color="inherit" />}{" "}
            <span className="mx-2">{t('logout')}</span>
          </Button>
        </MenuItem>
        {
          roleName == 'user'
            ? <MenuItem>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => setDialogOpen(true)}
                disabled={loadingDelete}
                sx={{ textTransform: "none", fontWeight: "500" }}
              >
                {loadingDelete && <CircularProgress size={20} color="inherit" />}{" "}
                {t('DeleteAccount')}
              </Button>
            </MenuItem>
            : <></>
        }

        {/* Dialog for editing information */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{t('UpdateInformation')}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label={t("Name")}
              value={formDataContainer.name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="address"
              label={t("Address")}
              value={formDataContainer.address}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="birthday"
              label={t("Birthday")}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formDataContainer.birthday}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="birth_place"
              label={t("Birth Place")}
              value={formDataContainer.birth_place}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="phone"
              label={t("Phone")}
              value={formDataContainer.phone}
              onChange={handleInputChange}
            />
            <div>
              {/* عرض الصورة المختارة أو الصورة الحالية من البروفايل */}
              <div style={{ marginBottom: "10px" }}>
                {previewImage ? (
                  <img src={previewImage} alt="Preview" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                ) : profileData?.avatar ? (
                  <img src={profileData.avatar} alt="Current Avatar" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                ) : (
                  <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "#ccc" }} />
                )}
              </div>

              {/* إدخال اختيار صورة */}
              <input type="file" accept="image/*" onChange={handleFileChange} />

              {/* زر رفع البيانات */}
              <button onClick={changeInfo}>تحديث المعلومات</button>

              {/* دائرة التحميل */}
              {uploadProgress !== null && (
                <div style={{ marginTop: "10px" }}>
                  <svg width="50" height="50" viewBox="0 0 36 36">
                    <path
                      fill="none"
                      stroke="#ccc"
                      strokeWidth="3"
                      d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      fill="none"
                      stroke="blue"
                      strokeWidth="3"
                      strokeDasharray={`${uploadProgress}, 100`}
                      d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div style={{ textAlign: "center" }}>{uploadProgress}%</div>
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>{t('Cancel')}</Button>
            <Button onClick={changeInfo} variant="contained" color="primary">
              {t('SaveChanges')}
            </Button>
          </DialogActions>
        </Dialog>
      </Popover>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {t('ChangePassword')}
          </Typography>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          {
            roleName == 'user'
              ? <Button
                variant="contained"
                onClick={handleChangePassword}
                fullWidth
                disabled={loadingChange}
              >
                {loadingChange ? <CircularProgress size={20} /> : `${t("Change Password")}`}
              </Button>
              : <></>
          }
        </Box>
      </Drawer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            textAlign: "center",
            paddingBottom: "16px",
          }}
        >
          {t('ConfirmAccountDeletion')}
        </DialogTitle>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              backgroundColor: "#f0f0f0",
              "&:hover": { backgroundColor: "#e0e0e0" },
              borderRadius: "8px",
              padding: "6px 16px",
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={deleteAccount}
            disabled={loadingDelete}
            sx={{
              marginLeft: "16px",
              borderRadius: "8px",
              padding: "6px 16px",
              backgroundColor: "#e57373",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            {loadingDelete ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              `${t("DeleteAccount")}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={50000}
        // onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={() => navigate(`/agencies/${dataNotification?.id}`)}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {dataNotification?.body}
        </Alert>
      </Snackbar>
    </Box>
  );
}
