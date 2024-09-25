import useHistory, { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import TabPanelView from "./page";
import { ListStar } from "@/components/ListStar";


const EditPage = () => {
    const { name, star } = useParams();
    return (
        <div className="h-full overflow-y-hidden">
            <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
                <b onClick={() => history.back()} 
                className="text-[var(--text-color-primary)] cursor-pointer">Danh sách nhân viên</b>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>{name ?? "- -"}</span>
           
            </div>
          
            <div className="flex items-center gap-4">
                <h3 className="my-6 pl-5 text-2xl">{name ?? "- -"}</h3> 
                <ListStar star={Number(star || 0)}/>
            </div>
            <div className="bg-white overflow-y-auto rounded-xl shadow-md sm:mx-5">
                <TabPanelView />
            </div>
        </div>
    );
}
export default EditPage;
