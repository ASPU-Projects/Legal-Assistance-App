import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logIn } from "../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";

export default function VerifyEmailPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [progressVerify, setProgressVerify] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = async (value: string, index: number) => {
    if (!isNaN(Number(value))) {
      const newOtp = [...otp];
      newOtp[index] = value;
      await setOtp(newOtp);

      //   because setState change the length after the all event
      if (otp.join("").length + 1 === 6) {
        const button = document.querySelector(
          "#buttonVerify"
        ) as HTMLButtonElement;
        button.click();
      }
      // Move to the next input if the current input is filled
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setProgressVerify(true);
    setError("");
    try {
      const otpCode = otp.join(""); // Combine OTP digits
      if (otpCode.length !== 6) {
        throw new Error("Please enter a valid 6-digit code.");
      }

      e.preventDefault();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}v1/web/auth/verify_code`,
        {
          email: localStorage.getItem("email"),
          code: otpCode,
        }
      );
      dispatch(logIn());
      navigate("/");
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      localStorage.removeItem("email");
    } catch (error: any) {
      setError(error?.response?.data?.message || "An error occurred.");
      setProgressVerify(false);
    }
  };
  return (
    <div className="logInInfo mx-auto containerLog z-10 relative" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-2/4">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="logo" className="w-32 h-32 rounded-full" />
          <span className="text-3xl font-bold text-white">
            {t('legalAssistant')}
          </span>
        </div>
        <p className="text-xl leading-10 text-white opacity-90">
          {t("Enter the 6-digit code sent to your email")}
        </p>
      </div>
      <Box
        component={motion.form}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, duration: 0.5 }}
        className="formContainer"
        onSubmit={handleSubmit}
      >
        <motion.h1 className="formTitle">{t("VerifyCode")}</motion.h1>
        <Grid container justifyContent="center" spacing={2}>
          {otp.map((_, index) => (
            <Grid component={'div'}>
              <TextField
                inputRef={(el) => (inputsRef.current[index] = el)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center", fontSize: "1.5rem" },
                }}
                value={otp[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e: any) => handleKeyDown(e, index)}
                variant="outlined"
                sx={{
                  width: "3rem",
                  height: "3rem",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        {error && (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          id="buttonVerify"
          variant="contained"
          fullWidth
          disabled={progressVerify}
          startIcon={progressVerify && <CircularProgress size={20} />}
          sx={{
            backgroundColor: progressVerify ? "#c1c1c1" : "#1d4c6a",
            color: "#fff",
            "&:hover": {
              backgroundColor: progressVerify ? "#c1c1c1" : "#4a6375",
            },
            marginTop: 5,
          }}
        >
          {progressVerify ? t("Verifying...") : t("Check")}
        </Button>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: 2, cursor: "pointer" }}
          onClick={() => navigate("/logup")}
        >
          {t("BackToLogin")}
        </Typography>
      </Box>
    </div>
  );
}
