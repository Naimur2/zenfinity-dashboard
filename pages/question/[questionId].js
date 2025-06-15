import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import styles from "../../styles/question.module.scss";
import { FieldArray, Form, Formik, getIn } from "formik";
import HelpIcon from "@mui/icons-material/Help";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import routes from "../../utils/routes";
import { useState } from "react";
import api from "../../utils/api";
import { apiError } from "../../utils/error";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  question: Yup.string().required(),
  answers: Yup.array().of(
    Yup.object().shape({
      answer: Yup.string().required("answer is required"),
    })
  ),
});

const CreateUpdateQuestion = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [questionDetails, setQuestionDetails] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (router.query.questionId) {
      setQuestionId(Number(router.query.questionId));
    }
  }, []);

  useEffect(() => {
    if (questionId) {
      getDetails();
    }
  }, [questionId]);

  const getDetails = () => {
    api
      .get(`${routes.QUESTIONS.DETAILS}/${questionId}`)
      .then((res) => res.data)
      .then((response) => {
        setQuestionDetails(response?.data);
      })
      .catch((err) => apiError(err));
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api
      .post(routes.QUESTIONS.UPLOAD_IMAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .then((response) => {
        setImageUrl(response?.imageUrl);
        return response?.data;
      })
      .catch((err) => apiError(err));
  };

  return (
    <Container maxWidth={"xl"} className={styles[`create-update-container`]}>
      <Box component={"div"} className={styles[`upper-section`]}>
        <Typography variant="h5">
          {`${questionId == 0 ? "Add" : "Edit"} question and answer`}{" "}
          <Tooltip title="Help Question answer">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>

        <Link href={"/question"}>
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
          <Formik
            initialValues={{
              question: questionId ? questionDetails?.question : "",
              answers: questionId
                ? questionDetails?.answers?.map((item) => {
                    return {
                      answer: item?.answer,
                      icon: item?.icon,
                    };
                  })
                : [
                    {
                      answer: "",
                      icon: "",
                    },
                  ],
            }}
            validateOnChange
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const createData = { ...values };
              if (!questionId) {
                api
                  .post(routes.QUESTIONS.ADD, createData)
                  .then((response) => response.data)
                  .then((res) => {
                    toast.success(res?.message);
                    resetForm();
                    router.push("/question");
                  })
                  .catch((err) => apiError(err));
              } else {
                createData["id"] = questionId;
                api
                  .put(routes.QUESTIONS.UPDATE, createData)
                  .then((response) => response.data)
                  .then((res) => {
                    toast.success(res?.message);
                    resetForm();
                    router.push("/question");
                  })
                  .catch((err) => apiError(err));
              }
            }}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              setFieldValue,
              isValid,
            }) => (
              <Form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box>
                      <label>Question*</label>
                    </Box>
                    <TextField
                      size="small"
                      name="question"
                      fullWidth
                      placeholder="Enter question"
                      value={values.question}
                      helperText={
                        errors.question &&
                        touched.question &&
                        String(errors.question)
                      }
                      error={Boolean(errors.question && touched.question)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FieldArray name="answers">
                      {({ push, remove }) => (
                        <Box>
                          {values?.answers?.map((a, index) => {
                            const answer = `answers[${index}].answer`;
                            const touchedAnswer = getIn(touched, answer);
                            const errorAnswer = getIn(errors, answer);

                            const icon = `answers[${index}].icon`;
                            // const touchedIcon = getIn(touched, icon);
                            // const errorIcon = getIn(errors, icon);

                            return (
                              <Grid container spacing={2} key={a.id}>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                  <Box>
                                    <label>Answer*</label>
                                  </Box>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    name={answer}
                                    value={a.answer}
                                    required
                                    helperText={
                                      touchedAnswer && errorAnswer
                                        ? errorAnswer
                                        : ""
                                    }
                                    error={Boolean(
                                      touchedAnswer && errorAnswer
                                    )}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                  <Box>
                                    <label>Upload Answer Icon</label>
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
                                      a?.icon ? (
                                        <Image
                                          width={20}
                                          height={20}
                                          src={`${imageUrl}/${a?.icon}`}
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
                                      onChange={async (event) => {
                                        const res = await uploadImage(
                                          event.target.files[0]
                                        );
                                        setFieldValue(icon, res);
                                      }}
                                    />
                                  </Button>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={2}
                                  lg={2}
                                  xl={2}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <Button
                                    className="btn"
                                    size="small"
                                    variant="contained"
                                    startIcon={<DeleteForeverIcon />}
                                    onClick={() => remove(index)}
                                  >
                                    Remove Answer
                                  </Button>
                                </Grid>
                              </Grid>
                            );
                          })}
                          <Button
                            className={`btn ${styles[`add-answer-wrapper`]}`}
                            size="small"
                            autoFocus
                            variant="contained"
                            startIcon={<QuestionAnswerIcon />}
                            onClick={() =>
                              push({
                                answer: "",
                                icon: "",
                              })
                            }
                          >
                            Add Answer
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                  </Grid>
                </Grid>

                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Box component={"div"} className={styles[`action-section`]}>
                  <Button
                    className="btn"
                    size="small"
                    type="submit"
                    autoFocus
                    variant="contained"
                    disabled={!isValid || values?.answers?.length === 0}
                  >
                    submit
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};
export default CreateUpdateQuestion;
