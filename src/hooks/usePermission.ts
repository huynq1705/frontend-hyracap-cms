import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { PermissionType } from "@/types/types";

const usePermissionCheck = (basePermission: any) => {
  const userInfo = useSelector(selectUserInfo);
  const defaultPermission = [
    "getDetail",
    "getList",
    "create",
    "update",
    "delete",
  ];
  const hasPermission = (key: string) => {
    return true;
    return userInfo.role && userInfo.role.role_permission.includes(key);
  };

  const checkPermissions = () => {
    const permissionStatus: any = {};

    defaultPermission.forEach((type) => {
      const permission = `${basePermission}.${type}`;
      permissionStatus[type] = hasPermission(permission);
    });

    return permissionStatus;
  };

  return {
    hasPermission: checkPermissions(),
    userInfo,
  };
};

export default usePermissionCheck;
