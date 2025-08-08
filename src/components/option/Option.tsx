import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import ComputerIcon from "@mui/icons-material/Computer";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTranslation } from "react-i18next";

export default function Option({mode,setMode}) {
  const { t, i18n } = useTranslation();
  const [alignment, setAlignment] = React.useState("left");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const children = [
    <ToggleButton value="left" key="left" color="primary">
      <WbSunnyIcon sx={{ mx: 1 }} />
      {t("light")}
    </ToggleButton>,
    <ToggleButton value="center" key="center" color="primary">
      <ComputerIcon sx={{ mx: 1 }} />
      {t("system")}
    </ToggleButton>,
    <ToggleButton value="right" key="right" color="primary">
      <NightlightRoundIcon sx={{ mx: 1 }} />
      {t("dark")}
    </ToggleButton>,
  ];

  const control = {
    value: alignment,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }} mt={1}>
      <ToggleButtonGroup size="medium" {...control} aria-label="small sizes">
        {children}
      </ToggleButtonGroup>
    </Stack>
  );
}
