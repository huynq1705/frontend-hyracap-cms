import Transition from "@/components/transition-dialog";
import { Dialog } from "@mui/material";
import DataMethod from "../../../components/data-method";

export interface PopupPickMethodProps {
  toggleDataMethodMobile?: any;
}
const transition = (props: any) => <Transition direction="up" {...props} />;
export default function PopupPickMethod(props: PopupPickMethodProps) {
  return (
    <Dialog open={true} onClose={() => {}} TransitionComponent={transition}>
      <div
        className="flex p-4 items-center justify-between"
        onClick={props.toggleDataMethodMobile}
      >
        <h3>Chọn phương thức thanh toán</h3>
      </div>
      <div className="flex px-4 h-[50vh] max-h-[50vh] overflow-y-auto" onClick={() => {
        props.toggleDataMethodMobile()
      }}>
        <DataMethod />
      </div>
    </Dialog>
  );
}
