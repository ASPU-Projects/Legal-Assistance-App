import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { dir } from "i18next";
import { useSelector } from "react-redux";
import { stateRedux } from "../../types";
import { IconButton } from "@mui/material";
import Option from "./Option";
import { useTranslation } from "react-i18next";
import SettingsIcon from "@mui/icons-material/Settings";
interface MyDrawerProps {
  mode: "light" | "dark"; // نوع النمط (فاتح/داكن)
  setMode: (mode: "light" | "dark") => void; // دالة لتغيير النمط
}
export default function MyDrawer({ mode, setMode }: MyDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  const language = useSelector((state: stateRedux) => state.language.language);

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 350, p: 1, justifyContent: "center" }}
      role="presentation"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <IconButton
          onClick={() => toggleDrawer(false)}
          aria-label="close"
          size="small"
          color="primary"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <span>{t("settings")}</span>
      </div>
      <Option setMode={setMode} mode={mode} />
    </Box>
  );

  return (
    <div className=" absolute left-0 top-1/2 z-10">
      <Button
        onClick={() => toggleDrawer(true)}
        startIcon={<SettingsIcon />}
      ></Button>
      <Drawer
        variant="temporary" // استخدام persistent لإبقاء القائمة مفتوحة
        anchor={`${dir(language) === "ltr" ? "left" : "right"}`}
        open={open}
        onClose={() => toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}
