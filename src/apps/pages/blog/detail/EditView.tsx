import * as React from "react";
import styles from "@/apps/pages/blog/createPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Switch } from "antd";
import MySelect from "@/components/input-custom-v2/select";
import { OptionSelect } from "@/types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { success } from "@/theme/palette";
import apiBlogCategoryService from "@/api/apiBlogCategory.service";
import apiBlogService from "@/api/apiBlog.service";
import apiProjectService from "@/api/project.service";
import { INIT_BLOG, InitBlogKeys } from "@/constants/init-state/blog";
import { ResponseBlogItem } from "@/types/blog.type";
import CkEditorCustom from "../components/CKEditor";
import UploadImage from "../components/UploadImg";

export interface BlogDetailPageProps {}

const VALIDATE = {
  title: "Tiêu đề bài viết là bắt buộc.",
  blog_category_id: "Danh mục bài viết là bắt buộc.",
  content: "Nội dung bài viết là bắt buộc.",
  image: "Ảnh bìa bài viết là bắt buộc.",
};

export default function BlogDetailPage(props: BlogDetailPageProps) {
  const { pathname } = useLocation();
  const parts = pathname.split("/");
  const id = parts[parts.length - 1];
  const isEditable = parts[parts.length - 2] === "edit";
  const navigate = useNavigate();
  const { getBlogDetail, putBlog } = apiBlogService();
  const { getAllBlogCategory } = apiBlogCategoryService();
  const { getProject } = apiProjectService();
  const [blogData, setBlogData] = React.useState<InitBlogKeys>(INIT_BLOG);
  const [isFirstRemoved, setIsfirstRemoved] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const [listType, setListType] = React.useState<OptionSelect>([]);
  const [listProject, setListProject] = React.useState<OptionSelect>([]);

  const handleChange = (field: string) => (value: any) => {
    setBlogData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fetchDataType = async () => {
    try {
      const response = await getAllBlogCategory();
      const projects = await getProject();
      const newListType = response.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      const newListProject = projects.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      setListProject(newListProject);
      setListType(newListType);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBlogDetail = async () => {
    try {
      const response = await getBlogDetail(id);

      setBlogData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePutBlogDetail = async () => {
    if (!blogData.id) return;
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    if (!blogData.title) newErrors.title = VALIDATE.title;
    if (!blogData.blog_category_id)
      newErrors.blog_category_id = VALIDATE.blog_category_id;
    if (blogData.content === "<p><br></p>")
      newErrors.content = VALIDATE.content;
    console.log("content", blogData.content);
    if (!blogData.link_img.length) newErrors.image = VALIDATE.image;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const convert_payload: ResponseBlogItem = {
        id: blogData.id,
        is_active: blogData.is_active,
        title: blogData.title,
        content: blogData.content,
        description: blogData.description,
        blog_category_id: blogData.blog_category_id,
        creator_id: blogData.creator_id,
        is_public: blogData.is_public ? 1 : 0,
        note: blogData.note,
        link_img: blogData.link_img,
        link_video: blogData.link_video,
        created_at: blogData.create_at,
        updated_at: new Date(),
      };
      const response = await putBlog(
        convert_payload,
        blogData.id.toString(),
        []
      );
      if (response.statusCode === 200) {
        dispatch(
          setGlobalNoti({
            type: "success",
            message: "Chỉnh sửa bài viết thành công",
          })
        );
        navigate(`/admin/blog/view/${blogData.id}`);
        location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    fetchBlogDetail();
    fetchDataType();
  }, []);
  return (
    <div className={styles.container}>
      <Breadcrumb
        className={styles.breadCrumb}
        separator={<FontAwesomeIcon icon={faAngleRight} />}
        items={[
          { title: "Bài viết", href: "/admin/blog" },
          { title: `${isEditable ? "Sửa" : "Xem"} bài viết` },
        ]}
      />
      <div className={styles.content}>
        <header>
          <h2>{isEditable ? "Sửa" : "Xem"} bài viết</h2>
          <div className={styles.buttonContainer}>
            {isEditable ? (
              <>
                <button
                  className={styles.discard}
                  onClick={() => {
                    navigate(`/admin/blog/view/${id}`);
                    // window.location.reload();
                  }}
                >
                  Huỷ
                </button>
                <button
                  className={styles.complete}
                  onClick={handlePutBlogDetail}
                >
                  Hoàn tất
                </button>
              </>
            ) : (
              <button
                className={styles.complete}
                onClick={() => {
                  navigate(`/admin/blog/edit/${id}`);
                  // window.location.reload();
                }}
              >
                Sửa bài viết
              </button>
            )}
          </div>
        </header>
        <div className={styles.editBlog}>
          <div className={styles.first}>
            <div className={styles.title}>
              <p>
                Tiêu đề bài viết <span>*</span>
              </p>
              <textarea
                disabled={!isEditable}
                value={blogData.title}
                onChange={(e) => handleChange("title")(e.target.value)}
                className={errors.title ? styles.error : ""}
              ></textarea>
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
                    disabled={!isEditable}
                    onChange={(e) => handleChange("is_public")(e)}
                  />
                  <h6>{blogData.is_public ? "Public" : "Unpublic"}</h6>
                </div>
              </div>
              <div className={styles.typeAndGr}>
                <div className={styles.type}>
                  <MySelect
                    options={listType}
                    handleChange={(e) => {
                      handleChange("blog_category_id")(e.target.value);
                    }}
                    values={{
                      blog_category_id: blogData.blog_category_id,
                    }}
                    validate={VALIDATE}
                    name="blog_category_id"
                    errors={[]}
                    type="select-one"
                    itemsPerPage={listType.length}
                    className="selectCreate"
                    required={["blog_category_id"]}
                    label="Danh mục"
                    disabled={!isEditable}
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
                    validate={VALIDATE}
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
              Mô tả bài viết<span>*</span>
            </p>
            <textarea
              disabled={!isEditable}
              value={blogData.description}
              onChange={(e) => handleChange("description")(e.target.value)}
              className={errors.title ? styles.error : ""}
            ></textarea>
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
              isEditable={isEditable}
              hasEror={errors.content === "Nội dung bài viết là bắt buộc."}
            />
            {errors.content && (
              <p className={styles.errorMessage}>{errors.content}</p>
            )}
          </div>
          <div className={styles.third}>
            <p className={styles.thirdTitle}>
              Ảnh bìa bài viết<span>*</span>
            </p>
            {(blogData.link_img.length > 0 || isFirstRemoved) && (
              <UploadImage
                setImgUrl={handleChange("link_img")}
                imageUrl={blogData.link_img}
                isEditable={isEditable}
                hasError={errors.image}
                isFirstRemoved={isFirstRemoved}
                setIsFirstRemoved={setIsfirstRemoved}
              />
            )}
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
              disabled={!isEditable}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
