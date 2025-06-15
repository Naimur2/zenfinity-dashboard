export default {
  URL: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
  AUTH: {
    LOG_IN: "/admin/auth/login",
  },
  WELCOME: {
    LIST: "/admin/welcome/list",
    DETAILS: "admin/welcome/detail",
    ADD: "/admin/welcome/create",
    UPDATE: "/admin/welcome/update",
    DELETE: "/admin/welcome/delete",
    UPLOAD_IMAGE: "/admin/welcome/upload-image",
  },
  QUESTIONS: {
    LIST: "/admin/question/list",
    ADD: "/admin/question/create",
    UPDATE: "/admin/question/update",
    DELETE: "/admin/question/delete",
    UPLOAD_IMAGE: "/admin/question/upload-image",
    DETAILS: "/admin/question/detail",
  },
  DASHBOARD: {
    LIST: "/admin/dashboard"
  },
  COURSE: {
    LIST: "/admin/course/list",
    ADD: "/admin/course/create",
    UPDATE: "/admin/course/update",
    DELETE: "/admin/course/delete",
    UPLOAD_IMAGE: "/admin/course/upload-image",
    UPLOAD_FILE: "/admin/course/upload-file",
    DETAILS: "/admin/course/detail",
    BREATHE_CATEGORY_LIST: "/admin/course/type-category-list/1",
    UPDATE_RANK: "/admin/course/update-course-rank",
    COURSE_TYPE: {
      LIST: "/admin/course/type-list",
      ADD: "/admin/course/type-create",
      UPDATE: "/admin/course/type-update",
      DELETE: "/admin/course/type-delete",
      DETAILS: "/admin/course/type-detail",
      CATEGORY: {
        LIST: "/admin/course/type-category-list",
        UPDATE: "/admin/course/type-category-update",
      },
    },
    FILE_TYPE: "/admin/course/file-type-list",
    FILE_PATH: "/admin/course/get-file",
    SUBSRIPTION_TYPE: "/admin/course/subscription-type-list",
  },
  SETTINGS: {
    PROFILE: "/admin/auth/profile",
  },
};
