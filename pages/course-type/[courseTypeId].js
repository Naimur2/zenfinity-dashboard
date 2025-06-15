import Link from "next/link";
import { useEffect } from "react";
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
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import api from "../../utils/api";
import routes from "../../utils/routes";
import styles from "../../styles/course-type.module.scss";
import { apiError } from "../../utils/error";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpIcon from "@mui/icons-material/Help";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }

  return errors;
};

const CreateUpdateCourseType = () => {
  const [courseTypeId, setCourseTypeId] = useState(null);
  const [courseTypeDetails, setCourseTypeDetails] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.query.courseTypeId) {
      setCourseTypeId(Number(router.query.courseTypeId));
    }
  }, []);

  useEffect(() => {
    if (courseTypeId) {
      getDetails(courseTypeId);
    }
  }, [courseTypeId]);

  const getDetails = () => {
    api
      .get(`${routes.COURSE.COURSE_TYPE.DETAILS}/${courseTypeId}`)
      .then((res) => res.data)
      .then((response) => {
        setCourseTypeDetails(response?.data);
      });
  };

  const create = (createData) => {
    api
      .post(routes.COURSE.COURSE_TYPE.ADD, createData)
      .then((response) => response.data)
      .then((res) => {
        toast.success(res?.message);
        router.push("/course-type");
      })
      .catch((err) => apiError(err));
  };

  const update = (createData) => {
    createData['id'] = courseTypeId;
    api
      .put(routes.COURSE.COURSE_TYPE.UPDATE, createData)
      .then((response) => response.data)
      .then((res) => {
        toast.success(res?.message);
        router.push("/course-type");
      })
      .catch((err) => apiError(err));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: courseTypeId ? courseTypeDetails?.name : "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      const createData = { ...values };
      if (!courseTypeId) {
        create(createData);
      } else {
        update(createData);
      }
    },
  });

  return (
    <Container maxWidth={"xl"} className={styles[`create-update-container`]}>
      <Box component={"div"} className={styles[`upper-section`]}>
        <Typography variant="h5">
          {`${courseTypeId == 0 ? "Add" : "Edit"} Course Type`}{" "}
          <Tooltip title="Help Course Type">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>

        <Link href={"/course-type"}>
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
                    <label>Course Type Name*</label>
                  </Box>
                  <TextField
                    size="small"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    fullWidth
                    placeholder="Enter course type name"
                    error={Boolean(formik.errors.name && formik.touched.name)}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.errors.name &&
                      formik.touched.name &&
                      String(formik.errors.name)
                    }
                  />
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

export default CreateUpdateCourseType;
