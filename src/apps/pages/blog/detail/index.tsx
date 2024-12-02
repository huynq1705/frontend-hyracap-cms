import * as React from "react";
import styles from "@/apps/pages/blog/createPage.module.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Switch } from "antd";
import MySelect from "@/components/input-custom-v2/select";
import { OptionSelect, UserInfo } from "@/types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import apiBlogCategoryService from "@/api/apiBlogCategory.service";
import AppConfig from "@/common/AppConfig";
import apiBlogService from "@/api/apiBlog.service";
import apiProjectService from "@/api/project.service";
import { INIT_BLOG, InitBlogKeys } from "@/constants/init-state/blog";
import { PayloadBlogItem } from "@/types/blog.type";
import CkEditorCustom from "../components/CKEditor";
import UploadImage from "../components/UploadImg";
import { selectUserInfo } from "@/redux/selectors/user.selector";
export interface BlogCreatePageProps {}

const VALIDATEV1 = {
  full_name: "Họ và tên không được chứa kí tự đặc biệt.",
  phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
const VALIDATE = {
  title: "Tiêu đề bài viết là bắt buộc.",
  blog_category_id: "Danh mục bài viết là bắt buộc.",
  content: "Nội dung bài viết là bắt buộc.",
  image: "Ảnh bìa bài viết là bắt buộc.",
  description: "Mô tả bài viết là bắt buộc",
};
const getAccessTokenAsync = () =>
  new Promise<string | null>((resolve, reject) => {
    const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
    resolve(accessToken);
  });

export default function BlogCreatePage(props: BlogCreatePageProps) {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const { postBlog } = apiBlogService();
  const dispatch = useDispatch();
  const { getAllBlogCategory } = apiBlogCategoryService();
  const { getProject } = apiProjectService();
  const [blogData, setBlogData] = React.useState<InitBlogKeys>(INIT_BLOG);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

  const handleChange = (field: string) => (value: any) => {
    // console.log("blogdata", blogData);

    setBlogData((prev) => ({ ...prev, [field]: value }));
  };
  const [listType, setListType] = React.useState<OptionSelect>([]);
  const [listProject, setListProject] = React.useState<OptionSelect>([]);
  const [blogCategoryId, setBlogCategoryId] = React.useState(
    blogData.blog_category_id
  );
  //   const [projectId, setProjectId] = React.useState(blogData.project_id);

  const fetchDataType = async () => {
    try {
      const response = await getAllBlogCategory();
      const projects = await getProject();

      const newListProject = projects.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      const newListType = response.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      setListProject(newListProject);
      setListType(newListType);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlePostBlogDetail = async () => {
    console.log("blogData", blogData);
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    if (!blogData.title) newErrors.title = VALIDATE.title;
    if (!blogData.description) newErrors.description = VALIDATE.description;
    if (blogCategoryId === 0)
      newErrors.blog_category_id = VALIDATE.blog_category_id;
    if (blogData.content === "") newErrors.content = VALIDATE.content;
    console.log("blogText ", blogData.content);
    if (blogData.link_img.length == 0) newErrors.image = VALIDATE.image;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const convert_payload: PayloadBlogItem = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        blog_category_id: blogCategoryId,
        creator_id: userInfo?.id,
        // creator_id: 2,
        is_public: blogData.is_public ? 1 : 0,
        note: blogData.note,
        link_img: blogData.link_img,
        link_video: [],
        project_id: blogData.project_id,
      };
      console.log("convert_payload", convert_payload);

      const response = await postBlog(convert_payload, []);
      if (response.statusCode === 200) {
        dispatch(
          setGlobalNoti({
            type: "success",
            message: "Tạo bài viết thành công",
          })
        );
        navigate(`/admin/blog/view/${response.data.id}`);
        location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  React.useEffect(() => {
    fetchDataType();
  }, []);
  React.useEffect(() => {
    setBlogData((prev) => ({ ...prev, blog_category_id: blogCategoryId }));
  }, [blogCategoryId]);
  return (
    <div className={styles.container}>
      <Breadcrumb
        className={styles.breadCrumb}
        separator={<FontAwesomeIcon icon={faAngleRight} />}
        items={[
          { title: "Bài viết", href: "/admin/blog" },
          { title: "Tạo bài viết" },
        ]}
      />
      <div className={styles.content}>
        <header>
          <h2>Tạo bài viết</h2>
          <div className={styles.buttonContainer}>
            <button
              className={styles.discard}
              onClick={() => navigate("/admin/blog")}
            >
              Huỷ
            </button>
            <button className={styles.complete} onClick={handlePostBlogDetail}>
              Hoàn tất
            </button>
          </div>
        </header>
        <div className={styles.editBlog}>
          <div className={styles.first}>
            <div className={styles.title}>
              <p>
                Tiêu đề bài viết <span>*</span>
              </p>
              <textarea
                value={blogData.title}
                onChange={(e) => handleChange("title")(e.target.value)}
                placeholder="Nhập"
                className={errors.title ? "error" : ""}
              />
              {errors.title && (
                <p className={styles.errorMessage}>{errors.title}</p>
              )}
            </div>
            <div className={styles.gr2}>
              <div className={styles.status}>
                <p>
                  Trạng thái <span>*</span>
                </p>
                <div className={styles.public}>
                  <Switch
                    checked={blogData.is_public ? true : false}
                    onChange={(checked) =>
                      handleChange("is_public")(checked ? 1 : 0)
                    }
                  />
                  <h6>{blogData.is_public ? "Public" : "Unpublic"}</h6>
                </div>
              </div>
              <div className={styles.typeAndGr}>
                <div className={styles.type}>
                  <MySelect
                    options={listType}
                    handleChange={(event) => {
                      handleChange("blog__category__id")(event.target.value);
                      setBlogCategoryId(event.target.value);
                    }}
                    values={{
                      blog__type: blogData.blog_category_id,
                    }}
                    validate={VALIDATEV1}
                    name="blog__type"
                    errors={[]}
                    type="select-one"
                    itemsPerPage={listType.length}
                    className={`selectCreate ${
                      errors.blog_category_id ? "errorSelect" : ""
                    }`}
                    required={["blog__type"]}
                    label="Danh mục"
                  />
                  {errors.blog_category_id && (
                    <p className={styles.errorMessage}>
                      {errors.blog_category_id}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.typeAndGr}>
                <div className={styles.type}>
                  <MySelect
                    options={listProject}
                    handleChange={(event) => {
                      handleChange("project_id")(event.target.value);
                      //   setProjectId(event.target.value);
                    }}
                    values={{
                      project_id: blogData.project_id,
                    }}
                    validate={VALIDATEV1}
                    name="project_id"
                    errors={[]}
                    type="select-one"
                    itemsPerPage={listProject.length}
                    className={`selectCreate ${
                      errors.blog_category_id ? "errorSelect" : ""
                    }`}
                    required={["project_id"]}
                    label="Dự án"
                  />
                  {/* {errors.blog_category_id && (
                    <p className={styles.errorMessage}>
                      {errors.blog_category_id}
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.description}>
            <p>
              Mô tả bài viết <span>*</span>
            </p>
            <textarea
              value={blogData.description}
              onChange={(e) => handleChange("description")(e.target.value)}
              placeholder="Nhập"
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <p className={styles.errorMessage}>{errors.description}</p>
            )}
          </div>
          <div className={styles.second}>
            <p className={styles.secondTitle}>
              Nội dung bài viết<span>*</span>
            </p>
            <CkEditorCustom
              contentData={blogData.content}
              setContentData={handleChange("content")}
              isEditable={true}
              hasEror={errors.content === "Nội dung bài viết là bắt buộc."}
            />
            {errors.content && (
              <p className={styles.errorMessage}>{errors.content}</p>
            )}
          </div>
          <div className={styles.third}>
            <p className={styles.thirdTitle}>
              Ảnh bìa bài viết <span>*</span>
            </p>
            <div className={styles.rule}>
              <p>Định dạng: JPEG, PNG</p>
              <p>Dung lượng ảnh không quá 5MB</p>
              <p>Tải lên tối đa 1 ảnh</p>
            </div>
            {/* <UploadImage imageUrl={imageUrl} setImgUrl={setImageUrl} isEditable= {true} hasError = {errors.image}/> */}
            <UploadImage
              setImgUrl={handleChange("link_img")}
              imageUrl={blogData.link_img}
              isEditable={true}
              hasError={errors.image}
              setIsFirstRemoved={(e) => {}}
            />
            {errors.image && (
              <p className={styles.errorMessage}>{errors.image}</p>
            )}
          </div>
          <div className={styles.fourth}>
            <p className={styles.fourthTitle}>Ghi chú</p>
            <textarea
              name=""
              id=""
              rows={2}
              placeholder="Thêm ghi chú"
              value={blogData.note}
              onChange={(e) => handleChange("note")(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
