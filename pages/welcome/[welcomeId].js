import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import routes from "../../utils/routes";
import { useRouter } from "next/router";
import styles from "../../styles/weclome.module.scss";
import Link from "next/link";
import { useEffect } from "react";
import { apiError } from "../../utils/error";
import Image from "next/image";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import HelpIcon from "@mui/icons-material/Help";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  width: 1,
});

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Required";
  }

  if (!values.step) {
    errors.step = "Required";
  }

  if (!values.color) {
    errors.color = "Required";
  }

  if (!values.colorText) {
    errors.colorText = "Required";
  }

  return errors;
};

const CreateUpdateWelcome = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [welcomeId, setWelcomeId] = useState(null);
  const [welcomeDetails, setWelcomeDetails] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.query.welcomeId) {
      setWelcomeId(Number(router.query.welcomeId));
    }
  }, []);

  useEffect(() => {
    if (welcomeId) {
      getDetails(welcomeId);
    }
  }, [welcomeId]);

  const uploadImage = (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    api
      .post(routes.WELCOME.UPLOAD_IMAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((response) => {
        setImageUrl(response?.imageUrl);
        formik.setFieldValue("image", response?.data);
      })
      .catch((err) => apiError(err));
  };

  const getDetails = (id) => {
    api
      .get(`${routes.WELCOME.DETAILS}/${id}`)
      .then((res) => res.data)
      .then((response) => {
        setWelcomeDetails(response?.data);
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: welcomeId ? welcomeDetails?.title : "",
      step: welcomeId ? welcomeDetails?.step : "",
      color: welcomeId ? welcomeDetails?.color : "",
      colorText: welcomeId ? welcomeDetails?.colorText : "",
      image: welcomeId ? welcomeDetails?.image : "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      const createData = { ...values };
      if (welcomeId == 0) {
        api
          .post(routes.WELCOME.ADD, createData)
          .then((response) => response.data)
          .then((res) => {
            toast.success(res?.message);
            resetForm();
            router.push("/welcome");
          });
      } else {
        createData["id"] = welcomeId;
        api
          .put(routes.WELCOME.UPDATE, createData)
          .then((response) => response.data)
          .then((res) => {
            toast.success(res?.message);
            resetForm();
            router.push("/welcome");
          });
      }
    },
  });

  return (
    <Container maxWidth={"xl"} className={styles[`create-update-container`]}>
      <Box component={"div"} className={styles[`upper-section`]}>
        <Typography variant="h5">
          {`${welcomeId == 0 ? "Add" : "Edit"} Welcome`}
          <Tooltip title="Help Welcome">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>
        <Link href={"/welcome"}>
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <Box>
                    <label>Title*</label>
                  </Box>
                  <TextField
                    size="small"
                    name="title"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    fullWidth
                    placeholder="Enter title"
                    error={Boolean(formik.errors.title && formik.touched.title)}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.errors.title &&
                      formik.touched.title &&
                      String(formik.errors.title)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <Box>
                    <label>Step*</label>
                  </Box>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    placeholder="Enter steps"
                    name="step"
                    onChange={formik.handleChange}
                    value={formik.values.step}
                    error={Boolean(formik.errors.step && formik.touched.step)}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.errors.step &&
                      formik.touched.step &&
                      String(formik.errors.step)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <Box>
                    <label>Color*</label>
                  </Box>
                  <TextField
                    size="small"
                    fullWidth
                    name="color"
                    type="color"
                    placeholder="Pick color"
                    onChange={formik.handleChange}
                    value={formik.values.color}
                    error={Boolean(formik.errors.color && formik.touched.color)}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.errors.color &&
                      formik.touched.color &&
                      String(formik.errors.color)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <Box>
                    <label>Color Name*</label>
                  </Box>
                  <TextField
                    size="small"
                    fullWidth
                    name="colorText"
                    placeholder="Enter color name"
                    onChange={formik.handleChange}
                    value={formik.values.colorText}
                    error={Boolean(
                      formik.errors.colorText && formik.touched.colorText
                    )}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.errors.colorText &&
                      formik.touched.colorText &&
                      String(formik.errors.colorText)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <label>Upload Image*</label>
                  </Box>
                  <Button
                    component="label"
                    size="large"
                    variant="outlined"
                    sx={{
                      borderStyle: "dashed",
                    }}
                    fullWidth
                    startIcon={
                      formik?.values?.image ? (
                        <Image
                          width={20}
                          height={20}
                          src={`${imageUrl}/${formik?.values?.image}`}
                          alt="uploaded Image"
                        />
                      ) : (
                        <InsertPhotoIcon />
                      )
                    }
                  >
                    Choose images to upload
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => {
                        uploadImage(event.target.files[0]);
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
              <Box component={"div"} className={styles[`action-section`]}>
                <Button
                  className="btn"
                  size="small"
                  type="submit"
                  autoFocus
                  variant="contained"
                  disabled={!(formik.isValid || formik.dirty)}
                >
                  Save changes
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateUpdateWelcome;
