import { memo, useMemo } from "react";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";

const UserTwoLetters = (): JSX.Element => {
  const userInfo = useSelector(selectUserInfo);
  const twoChars = useMemo(() => {
    return [userInfo?.family_name, userInfo?.given_name]
      .map((str) => (str ? str.charAt(0).toUpperCase() : ""))
      .join("");
  }, [userInfo]);

  return (
    <div className="h-8 w-8 rounded-full bg-[var(--text-color-primary)] font-bold text-white flex justify-center items-center">
      {!userInfo?.family_name || !userInfo?.given_name ? (
        <AccountCircleSharpIcon />
      ) : (
        <div>{twoChars}</div>
      )}
    </div>
  );
};

export default memo(UserTwoLetters);
