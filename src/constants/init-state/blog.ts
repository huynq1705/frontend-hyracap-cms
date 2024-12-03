export const INIT_BLOG = {
    title: "",
    content: "",
    id: 0,
    blog_category_id: 0,
    creator_id: 0,
    is_public: 0,
    note: "",
    link_img: [],
    link_video: [],
    create_at: new Date(),
    update_at: new Date(),
    is_active: true,
    description: "",
    project_id: 0,
};

export type InitBlogKeys = typeof INIT_BLOG;
