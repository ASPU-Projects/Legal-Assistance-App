// components/LanguageDropdown.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { Box, IconButton, List, ListItem, ListItemText, Popover, Toolbar } from '@mui/material';

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    setAnchorEl(null); // Close the popover
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <Toolbar>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: "relative", zIndex: "1000" }}
      >
        <FontAwesomeIcon icon={faLanguage} size='lg' color='' />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
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
          <List>
            {languages.map((lang, index) => (
              <ListItem
                key={index}
                divider
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#1d4c6a8a",
                    color: "#fff",
                    transform: "scale(1.02)",
                  },
                  "&:active": {
                    backgroundColor: "#1d4c6a",
                    color: "#fff",
                    transform: "scale(0.98)",
                  },
                }}
                onClick={() => changeLanguage(lang.code)}
              >
                <ListItemText
                  primary={`${lang.name}`}
                  sx={{
                    textAlign: i18n.language === 'ar' ? 'right' : 'left',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </Toolbar>
  );
};

export default LanguageDropdown;