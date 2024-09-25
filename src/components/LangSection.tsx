import useCustomTranslation from "@/hooks/useCustomTranslation";
import { selectLang } from "@/redux/selectors/app.selector";
import { setLang } from "@/redux/slices/app.slice";
import { Lang } from "@/types/types";
import Path from "@/utils/path";
import {
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
} from "@mui/material";
import { memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const LANGS: Lang[] = ["vi", "en"];

const LangSection = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const lang = useSelector(selectLang);
  const dispatch = useDispatch();
  const { t } = useCustomTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLang = (lang: Lang) => {
    dispatch(setLang(lang));
    handleClose();
  };

  return (
    <div>
      <Button className="animate-fadeleft !rounded-lg" onClick={handleClick}>
        <div className="flex items-center space-x-2">
          <img src={Path.get(`../assets/images/${lang}.png`)} />
          <span className="uppercase">{lang}</span>
        </div>
      </Button>
      <Popover
        id={!!anchorEl ? "lang-menu" : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper>
          <MenuList dense>
            {LANGS.map((lang) => (
              <MenuItem key={lang} onClick={() => handleSelectLang(lang)}>
                <ListItemIcon>
                  <img src={Path.get(`../assets/images/${lang}.png`)} />
                </ListItemIcon>
                <ListItemText className="uppercase">{t(lang)}</ListItemText>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popover>
    </div>
  );
};

export default memo(LangSection);
