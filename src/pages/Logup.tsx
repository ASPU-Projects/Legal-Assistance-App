import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Upload, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { stateRedux } from "../types";
import { useTranslation } from "react-i18next";
// import Tsparticles from "../components/Log/tsparticles";

import axios from "axios";
import { logIn } from "../store/slices/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function LogupPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const animationVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [isSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birth_place, setBirthPlace] = useState("");
  const [national_number, setNationalNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar]: any = useState(null); // حالة جديدة لإدارة الصورة
  const [progressLog, setProgressLog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleToggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleGenderChange = (event) => setGender(event.target.value);

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]); // تحديث حالة الصورة
  };
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    password_confirmation: "",
    email: "",
    address: "",
    birthdate: "",
    birth_place: "",
    national_number: "",
    gender: "",
    phone: "",
    avatar: "",
  });
  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setProgressLog(true);

    const formData = new FormData(); // استخدام FormData لإرسال البيانات
    formData.append("name", username);
    formData.append("password", password);
    formData.append("password_confirmation", password_confirmation);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("birthdate", birthdate);
    formData.append("birth_place", birth_place);
    formData.append("national_number", national_number);
    formData.append("gender", gender);
    formData.append("phone", phone);
    if (avatar) {
      formData.append("avatar", avatar); // إضافة الصورة إلى FormData
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}v1/web/by_user/sign_up`,
        formData
      );
      // dispatch(logIn());
      localStorage.setItem("email", email);
      if (res?.data?.isSuccess) {
        navigate("/VerifyCode")
      }
      setProgressLog(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error(error.response.data.error);
        const serverErrors = error.response.data.error;
        setErrors({
          // ...prevErrors,
          username: serverErrors.name?.[0] || "",
          password: serverErrors.password?.[0] || "",
          password_confirmation: serverErrors.password_confirmation?.[0] || "",
          email: serverErrors.email?.[0] || "",
          address: serverErrors.address?.[0] || "",
          birthdate: serverErrors.birthdate?.[0] || "",
          birth_place: serverErrors.birth_place?.[0] || "",
          national_number: serverErrors.national_number?.[0] || "",
          gender: serverErrors.gender?.[0] || "",
          phone: serverErrors.phone?.[0] || "",
          avatar: serverErrors.avatar?.[0] || "",
        });
      }
      setProgressLog(false);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setAvatar(files[0]); // حفظ الملف
    }
  };

  return (
    <div className={`logInInfo mx-auto containerLog z-10 relative `} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-2/4">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="logo" className="w-32 h-32 rounded-full" />
          <span className="text-3xl font-bold text-white">
            {t('legalAssistant')}
          </span>
        </div>
        <p className="text-xl leading-10 text-white opacity-90">
          {t("legalSystemWho")}
        </p>
      </div>
      <Box
        component={motion.form}
        initial={isSignUp ? "hidden" : "visible"}
        animate={isSignUp ? "visible" : "hidden"}
        transition={{ delay: 0.1, duration: 0.5 }}
        variants={animationVariants}
        className="formContainer"
        onSubmit={submit}
      >
        <motion.h1 variants={animationVariants} className="formTitle">
          {t("CreateAccount")}
        </motion.h1>
        <Grid container spacing={2} className="inputGroup">
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("UserName")}
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              error={errors.username ? true : false}
              required
            />
            {errors.username && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.username}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Email")}
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              error={errors.email ? true : false}
              required
            />
            {errors.email && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.email}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Password")}
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password ? true : false}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            {errors.password && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.password}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("ConfirmPassword")}
              variant="outlined"
              type={showConfirmPassword ? "text" : "password"}
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              error={errors.password ? true : false}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            {errors.password && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.password}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Address")}
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
              error={errors.address ? true : false}
              required
            />
            {errors.address && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.address}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("NationalNumber")}
              variant="outlined"
              fullWidth
              value={national_number}
              onChange={(e) => setNationalNumber(e.target.value)}
              margin="normal"
              error={errors.national_number ? true : false}
              required
            />
            {errors.national_number && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.national_number}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("BirthPlace")}
              variant="outlined"
              fullWidth
              value={birth_place}
              onChange={(e) => setBirthPlace(e.target.value)}
              margin="normal"
              error={errors.birth_place ? true : false}
              required
            />
            {errors.birth_place && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.birth_place}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Birthday")}
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              margin="normal"
              error={errors.birthdate ? true : false}
              required
            />
            {errors.birthdate && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.birthdate}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t("Gender")}
              value={gender}
              onChange={handleGenderChange}
              fullWidth
              margin="normal"
              error={errors.gender ? true : false}
              required
            >
              <MenuItem value="male">{t("Male")}</MenuItem>
              <MenuItem value="female">{t("Female")}</MenuItem>
            </TextField>
            {errors.gender && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.gender}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Phone")}
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              error={errors.phone ? true : false}
              required
            />
            {errors.phone && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.phone}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="image">
              <input
                id="image"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
                required
              />
              <Button
                variant="contained"
                component="span" // يسمح باستخدام الزر كعنصر HTML
                startIcon={<Upload />} // يمكن استبدالها بأيقونة أخرى مثل Upload
                sx={{
                  backgroundColor: "#1d4c6a",
                  color: "#fff",
                  background: `${isDragging ? "#4a6375" : errors.avatar ? "red" : ""}`,
                  "&:hover": { backgroundColor: "#4a6375" },
                  textTransform: "none",
                }}
                className={`${isDragging ? " bg-black" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {t('UploadImage')}
              </Button>{" "}
            </label>
            {avatar?.name ? avatar?.name : ""}

            {errors.avatar && (
              <Typography color="error" sx={{ fontWeight: "bold" }}>
                {errors.avatar}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={progressLog}
          startIcon={progressLog && <CircularProgress size={20} />}
          sx={{
            backgroundColor: progressLog ? "#c1c1c1" : "#1d4c6a",
            color: "#fff",
            "&:hover": {
              backgroundColor: progressLog ? "#c1c1c1" : "#4a6375",
            },
            marginTop: 2,
          }}
        >
          {progressLog ? t("Loading...") : t("logup")}
        </Button>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: 2, cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          {t("already")}
        </Typography>
      </Box>
    </div>
  );
}
