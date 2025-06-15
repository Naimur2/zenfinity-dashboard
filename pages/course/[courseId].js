import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import styles from "../../styles/course.module.scss";
import { useFormik } from "formik";
import routes from "../../utils/routes";
import api from "../../utils/api";
import { apiError } from "../../utils/error";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpIcon from "@mui/icons-material/Help";
import DeleteIcon from "@mui/icons-material/Delete";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
});

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Required";
  }
  if (!values.subTitle) {
    errors.subTitle = "Required";
  }
  if (values.rank != 0 && !values.rank) {
    errors.rank = "Required";
  }
  if (!values.typeId) {
    errors.typeId = "Required";
  } else if (values.typeId == 1 && !values.categoryId) {
    errors.categoryId = "Required";
  }
  if (!values.subscriptionType && values.subscriptionType != 0) {
    errors.subscriptionType = "Required";
  }
  // if (!values.courseDetailsHeading) {
  //   errors.courseDetailsHeading = "Required";
  // }
  // if (!values.courseDetailsDescription) {
  //   errors.courseDetailsDescription = "Required";
  // }
  // if (!values.courseFileTitle) {
  //   errors.courseFileTitle = "Required";
  // }
  // if (!values.courseFileDescription) {
  //   errors.courseFileDescription = "Required";
  // }
  if (!values.courseFileTotalTime) {
    errors.courseFileTotalTime = "Required";
  }
  if (!values.courseFileType) {
    errors.courseFileType = "Required";
  }
  if (!values.thumbnail) {
    errors.thumbnail = "Required";
  }
  if (!values.banner) {
    errors.banner = "Required";
  }
  // if (!values.courseFile) {
  //   errors.courseFile = "Required";
  // }
  return errors;
};

const CreateUpdateCourse = () => {
  const router = useRouter();
  const [courseId, setCourseId] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [courseTypeList, setCourseTypeList] = useState([]);
  const [fileTypes, setFileTypes] = useState({});
  const [subsriptionList, setSubsriptionList] = useState({});

  const [loading, setLoading] = useState(null);

  const getCourseDetails = () => {
    api
      .get(`${routes?.COURSE?.DETAILS}/${courseId}`)
      .then((res) => res.data)
      .then((response) => {
        setCourseDetails(response?.data);
      })
      .catch((err) => apiError(err));
  };

  const getFileTypes = () => {
    api
      .get(`${routes?.COURSE.FILE_TYPE}`)
      .then((res) => res.data)
      .then((response) => {
        setFileTypes(response?.data);
      })
      .catch((err) => apiError(err));
  };

  const getSubsriptionTypes = () => {
    api
      .get(`${routes?.COURSE.SUBSRIPTION_TYPE}`)
      .then((res) => res.data)
      .then((response) => {
        setSubsriptionList(response?.data);
      })
      .catch((err) => apiError(err));
  };

  const createUpdateCourse = (createData) => {
    const newData = {
      typeId: createData?.typeId,
      title: createData?.title,
      subTitle: createData?.subTitle,
      rank: createData?.rank,
      thumbnail: createData?.thumbnail,
      banner: createData?.banner,
      subscriptionType: createData?.subscriptionType,
      categoryId: createData?.categoryId,
      tutorialLink: createData.tutorialLink,
      tutorialFile: createData.tutorialFile,
      tutorialThumbnail: createData.tutorialThumbnail,
      tutorialActive: createData.tutorialActive,
      courseDetails: [
        {
          heading: createData?.courseDetailsHeading,
          description: createData?.courseDetailsDescription,
        },
        ...moreCourseDetails,
      ],
      courseFiles: [
        {
          title: createData?.courseFileTitle,
          description: createData?.courseFileDescription,
          file: createData?.courseFile,
          totalTime: createData?.courseFileTotalTime,
          type: createData?.courseFileType,
        },
      ],
    };

    if (courseId == 0) {
      api
        .post(routes.COURSE.ADD, newData)
        .then((response) => response.data)
        .then((res) => {
          toast.success(res?.message);
          router.push("/course");
        })
        .catch((err) => apiError(err));
    } else {
      newData["id"] = courseId;
      api
        .put(routes.COURSE.UPDATE, newData)
        .then((response) => response.data)
        .then((res) => {
          toast.success(res?.message);
          router.push("/course");
        })
        .catch((err) => apiError(err));
    }
  };

  const uploadImage = (fieldName, imageFile) => {
    setLoading(fieldName);
    const formData = new FormData();
    formData.append("image", imageFile);
    api
      .post(routes.COURSE.UPLOAD_IMAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((response) => {
        setImageUrl(response?.imageUrl);
        formik.setFieldValue(fieldName, response.data);
        setLoading(null)
      })
      .catch((err) => {
        setLoading(null)
        apiError(err)});
  };

  const uploadFile = (fieldName, file) => {
    setLoading(fieldName);
    const formData = new FormData();
    formData.append("file", file);
    api
      .post(routes.COURSE.UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((response) => {
        setFileUrl(response?.attachment?.Location);
        formik.setFieldValue(fieldName, response.attachment?.Key);
        setLoading(null);
      })
      .catch((err) => {
        setLoading(null);
        apiError(err);
      });
  };

  const getCourseTypeList = () => {
    api
      .get(`${routes?.COURSE.COURSE_TYPE.LIST}`)
      .then((res) => res.data)
      .then((response) => {
        setCourseTypeList(response?.data);
      })
      .catch((err) => apiError(err));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      typeId: courseId ? courseDetails?.course_type?.id : null,
      title: courseId ? courseDetails?.title : "",
      subTitle: courseId ? courseDetails?.subTitle : "",
      rank: courseId ? courseDetails?.rank : "",
      thumbnail: courseId ? courseDetails?.thumbnail : null,
      banner: courseId ? courseDetails?.banner : null,
      subscriptionType: courseId ? courseDetails?.subscriptionType : null,
      courseDetailsHeading: courseId
        ? courseDetails?.course_details?.[0]?.heading
        : "",
      courseDetailsDescription:
        courseDetails?.course_details?.[0]?.description || "",
      courseFileTitle: courseId ? courseDetails?.course_files?.[0]?.title : "",
      courseFileDescription:
        courseDetails?.course_files?.[0]?.description || "",
      courseFile: courseId ? courseDetails?.course_files?.[0]?.file : null,
      courseFileTotalTime: courseId
        ? courseDetails?.course_files?.[0]?.totalTime
        : "",
      courseFileType: courseId ? courseDetails?.course_files?.[0]?.type : "",
      categoryId: courseId ? courseDetails?.categoryId : null,
      tutorialFile: courseId ? courseDetails?.tutorialFile : null,
      tutorialThumbnail: courseId ? courseDetails?.tutorialThumbnail : "",
      tutorialActive: courseId ? courseDetails?.tutorialActive : false,
    },
    validate,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      const createData = { ...values };
      createUpdateCourse(createData);
    },
  });

  // FETCHES
  useEffect(() => {
    if (router.query.courseId) {
      setCourseId(Number(router.query.courseId));
    }
  }, []);

  useEffect(() => {
    getFileTypes();
    getSubsriptionTypes();
    getCourseTypeList();
    getBreatheCategoryList();
  }, []);

  useEffect(() => {
    if (courseId) {
      getCourseDetails();
    }
  }, [courseId]);

  useEffect(() => {
    if (courseDetails) {
      if (courseDetails.course_details?.length > 0) {
        let moreData = [];
        courseDetails?.course_details?.forEach((i, idx) => {
          if (idx > 0) {
            moreData.push({ heading: i.heading, description: i.description });
          }
        });
        setMoreCourseDetails(moreData);
      }
    }
  }, [courseDetails]);

  const [moreCourseDetails, setMoreCourseDetails] = useState([]);
  const moreDataEdit = (index, key) => (e) => {
    const text = e.target.value;
    const newData = moreCourseDetails.map((item, idx) => {
      if (idx == index) return { ...item, [key]: text };
      else return item;
    });
    setMoreCourseDetails(newData);
  };
  const moreDataDelete = (index) => () => {
    setMoreCourseDetails((prev) => prev.filter((i, idx) => idx != index));
  };

  const getBreatheCategoryList = () => {
    api
      .get(routes.COURSE.BREATHE_CATEGORY_LIST)
      .then((res) => res.data.data)
      .then((res) => setCourseTypeCatList(res))
      .catch((err) => apiError(err));
  };
  const [courseTypeCatList, setCourseTypeCatList] = useState([]);
  const [showCourseTypeCat, setShowCourseTypeCat] = useState(false);
  useEffect(() => {
    const courseType = courseTypeList.find(
      (i) => i.id === formik.values.typeId
    );
    if (courseType?.name?.toLowerCase?.() === "breathe") {
      setShowCourseTypeCat(true);
    } else {
      setShowCourseTypeCat(false);
    }
  }, [formik.values.typeId]);

  return (
    <Container maxWidth={"xl"} className={styles[`create-update-container`]}>
      <Box component={"div"} className={styles[`upper-section`]}>
        <Typography variant="h5">
          {`${courseId == 0 ? "Add" : "Edit"} Course`}{" "}
          <Tooltip title="Help Course">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>
        <Link href={"/course"}>
          <Button
            className="back-btn"
            size="large"
            variant="text"
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Link>
      </Box>
      <Card variant="outlined">
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Course Title*</label>
                </Box>
                <TextField
                  size="small"
                  name="title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  fullWidth
                  placeholder="Enter course title"
                  error={Boolean(formik.errors.title && formik.touched.title)}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.title &&
                    formik.touched.title &&
                    String(formik.errors.title)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Course SubTitle*</label>
                </Box>
                <TextField
                  size="small"
                  name="subTitle"
                  onChange={formik.handleChange}
                  value={formik.values.subTitle}
                  fullWidth
                  placeholder="Enter course subTitle"
                  error={Boolean(
                    formik.errors.subTitle && formik.touched.subTitle
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.subTitle &&
                    formik.touched.subTitle &&
                    String(formik.errors.subTitle)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Course Rank*</label>
                </Box>
                <TextField
                  size="small"
                  name="rank"
                  onChange={formik.handleChange}
                  value={formik.values.rank}
                  fullWidth
                  type="number"
                  placeholder="Enter course rank"
                  error={Boolean(formik.errors.rank && formik.touched.rank)}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.rank &&
                    formik.touched.rank &&
                    String(formik.errors.rank)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box>
                  <label>Course Type*</label>
                </Box>
                <Select
                  name="typeId"
                  value={formik.values.typeId}
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.typeId && formik.touched.typeId)}
                >
                  {courseTypeList?.map((course, idx) => {
                    return (
                      <MenuItem key={idx} value={course?.id}>
                        {course?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.errors.typeId && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>

              {showCourseTypeCat && (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Box>
                    <label>Course Type Category</label>
                  </Box>
                  <Select
                    name="categoryId"
                    value={formik.values.categoryId}
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      formik.errors.categoryId && formik.touched.categoryId
                    )}
                  >
                    {courseTypeCatList?.map((cat, idx) => {
                      return (
                        <MenuItem key={idx} value={cat?.id}>
                          {cat?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {formik.errors.categoryId && (
                    <FormHelperText error>Required</FormHelperText>
                  )}
                </Grid>
              )}
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box>
                  <label>Subsription Type*</label>
                </Box>
                <Select
                  name="subscriptionType"
                  value={formik.values.subscriptionType}
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.errors.subscriptionType &&
                      formik.touched.subscriptionType
                  )}
                >
                  {Object.entries(subsriptionList)?.map((key, val) => {
                    return (
                      <MenuItem key={key[1]} value={key[1]}>
                        {key[0]}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.errors.subscriptionType && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box>
                  <label>Upload Thumbnail*</label>
                </Box>
                <Button
                  component="label"
                  size="large"
                  color={formik.errors.thumbnail && "error"}
                  variant="outlined"
                  sx={{
                    borderStyle: "dashed",
                  }}
                  fullWidth
                  startIcon={
                    formik.values.thumbnail ? (
                      <Image
                        width={20}
                        height={20}
                        src={`${imageUrl}/${formik.values.thumbnail}`}
                        alt="uploaded Image"
                      />
                    ) : (
                      <InsertPhotoIcon />
                    )
                  }
                >
                  Choose thumbnail to upload
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={async (event) => {
                      uploadImage("thumbnail", event.target.files[0]);
                    }}
                  />
                </Button>
                {formik.errors.thumbnail && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box>
                  <label>Upload Banner*</label>
                </Box>
                <Button
                  component="label"
                  size="large"
                  variant="outlined"
                  color={formik.errors.banner && "error"}
                  sx={{
                    borderStyle: "dashed",
                  }}
                  fullWidth
                  startIcon={
                    formik.values.banner ? (
                      <Image
                        width={20}
                        height={20}
                        src={`${imageUrl}/${formik.values.banner}`}
                        alt="uploaded Image"
                      />
                    ) : (
                      <InsertPhotoIcon />
                    )
                  }
                >
                  Choose image to upload
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={async (event) => {
                      uploadImage("banner", event.target.files[0]);
                    }}
                  />
                </Button>
                {formik.errors.banner && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                <Box>
                  <label>Tab Heading*</label>
                </Box>
                <TextField
                  size="small"
                  name="courseDetailsHeading"
                  onChange={formik.handleChange}
                  value={formik.values.courseDetailsHeading}
                  fullWidth
                  placeholder="Enter Tab Heading"
                  error={Boolean(
                    formik.errors.courseDetailsHeading &&
                      formik.touched.courseDetailsHeading
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.courseDetailsHeading &&
                    formik.touched.courseDetailsHeading &&
                    String(formik.errors.courseDetailsHeading)
                  }
                />
              </Grid>
              <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                <Box>
                  <label>Tab Description*</label>
                </Box>
                <TextField
                  multiline
                  rows={4}
                  size="small"
                  name="courseDetailsDescription"
                  onChange={formik.handleChange}
                  value={formik.values.courseDetailsDescription}
                  fullWidth
                  placeholder="Enter Tab Description"
                  error={Boolean(
                    formik.errors.courseDetailsDescription &&
                      formik.touched.courseDetailsDescription
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.courseDetailsDescription &&
                    formik.touched.courseDetailsDescription &&
                    String(formik.errors.courseDetailsDescription)
                  }
                />
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingBottom: "5px",
                }}
              >
                <Button
                  size="small"
                  className="btn"
                  variant="contained"
                  onClick={() =>
                    setMoreCourseDetails((prev) => [
                      ...prev,
                      {
                        heading: "",
                        description: "",
                      },
                    ])
                  }
                >
                  Add More
                </Button>
              </Grid>

              {moreCourseDetails.map(({ heading, description }, idx) => (
                <>
                  <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                    <Box>
                      <label>Tab Heading*</label>
                    </Box>
                    <TextField
                      size="small"
                      name="courseDetailsHeading"
                      onChange={moreDataEdit(idx, "heading")}
                      value={heading}
                      fullWidth
                      placeholder="Enter tab Heading"
                    />
                  </Grid>
                  <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                    <Box>
                      <label>Tab Description*</label>
                    </Box>
                    <TextField
                      multiline
                      rows={4}
                      size="small"
                      name="courseDetailsDescription"
                      onChange={moreDataEdit(idx, "description")}
                      value={description}
                      fullWidth
                      placeholder="Enter Tab Description"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={1}
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      paddingBottom: "5px",
                    }}
                  >
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={moreDataDelete(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </>
              ))}

              {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box>
                  <label>Course File Title*</label>
                </Box>
                <TextField
                  size="small"
                  name="courseFileTitle"
                  onChange={formik.handleChange}
                  value={formik.values.courseFileTitle}
                  fullWidth
                  placeholder="Enter course file title"
                  error={Boolean(
                    formik.errors.courseFileTitle &&
                      formik.touched.courseFileTitle
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.courseFileTitle &&
                    formik.touched.courseFileTitle &&
                    String(formik.errors.courseFileTitle)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box>
                  <label>Course File Description*</label>
                </Box>
                <TextField
                  size="small"
                  name="courseFileDescription"
                  onChange={formik.handleChange}
                  value={formik.values.courseFileDescription}
                  fullWidth
                  placeholder="Enter Tab Description"
                  error={Boolean(
                    formik.errors.courseFileDescription &&
                      formik.touched.courseFileDescription
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.courseFileDescription &&
                    formik.touched.courseFileDescription &&
                    String(formik.errors.courseFileDescription)
                  }
                />
              </Grid> */}
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Course File Type*</label>
                </Box>
                <Select
                  name="courseFileType"
                  placeholder="Select file type"
                  value={formik.values.courseFileType}
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.errors.courseFileType &&
                      formik.touched.courseFileType
                  )}
                >
                  {Object.entries(fileTypes)?.map((key, val) => {
                    return (
                      <MenuItem key={val} value={key[1]}>
                        {key[0]}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.errors.courseFileType && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Course Total Time (in sec)*</label>
                </Box>
                <TextField
                  size="small"
                  type="number"
                  name="courseFileTotalTime"
                  onChange={formik.handleChange}
                  value={formik.values.courseFileTotalTime}
                  fullWidth
                  placeholder="Enter course total time"
                  error={Boolean(
                    formik.errors.courseFileTotalTime &&
                      formik.touched.courseFileTotalTime
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.courseFileTotalTime &&
                    formik.touched.courseFileTotalTime &&
                    String(formik.errors.courseFileTotalTime)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Course File*</label>
                </Box>
                {loading === 'courseFile'? (
                  <Box>
                    Uploading...
                    <LinearProgress />
                  </Box>
                ) : (
                  <Button
                    component="label"
                    size="large"
                    variant="outlined"
                    sx={{
                      borderStyle: "dashed",
                    }}
                    disabled={formik.values.courseFileType === ""}
                    color={formik.errors.courseFile && "error"}
                    fullWidth
                    startIcon={
                      formik?.values?.courseFile ? (
                        <>File uploaded</>
                      ) : (
                        <>Choose course file to upload</>
                      )
                    }
                  >
                    <VisuallyHiddenInput
                      type="file"
                      accept={`${
                        formik.values.courseFileType == 1
                          ? "audio/*"
                          : "video/*"
                      }`}
                      onChange={(event) => {
                        uploadFile("courseFile", event.target.files[0]);
                      }}
                    />
                  </Button>
                )}
                {formik.errors.courseFile && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Tutorial File</label>
                </Box>
                {loading === 'tutorialFile'? (
                  <Box>
                    Uploading...
                    <LinearProgress />
                  </Box>
                ) : (
                <Button
                  component="label"
                  size="large"
                  variant="outlined"
                  sx={{
                    borderStyle: "dashed",
                  }}
                  color={formik.errors.tutorialFile && "error"}
                  fullWidth
                  startIcon={
                    formik?.values?.tutorialFile ? (
                      <>File uploaded</>
                    ) : (
                      <>Choose tutorial file to upload</>
                    )
                  }
                >
                  <VisuallyHiddenInput
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      uploadFile("tutorialFile", event.target.files[0]);
                    }}
                  />
                </Button>
                )}
                {formik.errors.tutorialFile && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Tutorial Link</label>
                </Box>
                <TextField
                  size="small"
                  name="tutorialLink"
                  onChange={formik.handleChange}
                  value={formik.values.tutorialLink}
                  fullWidth
                  placeholder="Enter Tutorial Link"
                  error={Boolean(
                    formik.errors.tutorialLink && formik.touched.tutorialLink
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.tutorialLink &&
                    formik.touched.tutorialLink &&
                    String(formik.errors.tutorialLink)
                  }
                />
              </Grid> */}
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Tutorial Thumbnail</label>
                </Box>
                {loading === 'tutorialThumbnail'? (
                  <Box>
                    Uploading...
                    <LinearProgress />
                  </Box>
                ) : (
                <Button
                  component="label"
                  size="large"
                  variant="outlined"
                  sx={{
                    borderStyle: "dashed",
                  }}
                  color={formik.errors.tutorialThumbnail && "error"}
                  fullWidth
                  startIcon={
                    formik?.values?.tutorialThumbnail ? (
                      <>File uploaded</>
                    ) : (
                      <>Choose tutorial file to upload</>
                    )
                  }
                >
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      uploadImage("tutorialThumbnail", event.target.files[0]);
                    }}
                  />
                </Button>
                )}
                {formik.errors.tutorialThumbnail && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </Grid>
              {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Tutorial Thumbnail</label>
                </Box>
                <TextField
                  size="small"
                  name="tutorialThumbnail"
                  onChange={formik.handleChange}
                  value={formik.values.tutorialThumbnail}
                  fullWidth
                  placeholder="Enter Tutorial Thumbnail"
                  error={Boolean(
                    formik.errors.tutorialThumbnail &&
                      formik.touched.tutorialThumbnail
                  )}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.errors.tutorialThumbnail &&
                    formik.touched.tutorialThumbnail &&
                    String(formik.errors.tutorialThumbnail)
                  }
                />
              </Grid> */}
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box>
                  <label>Tutorial File</label>
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="tutorialActive"
                      onChange={formik.handleChange}
                      value={formik.values.tutorialActive}
                      checked={formik.values.tutorialActive}
                    />
                  }
                  label="Show Tutorial File"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    size="small"
                    className="btn"
                    type="submit"
                    autoFocus
                    variant="contained"
                    disabled={!(formik.isValid || formik.dirty) || loading}
                  >
                    Save changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateUpdateCourse;
