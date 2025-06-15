import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Image from "next/image";
import api from "../../utils/api";
import routes from "../../utils/routes";
import { apiError } from "../../utils/error";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../../styles/course.module.scss";
import HelpIcon from "@mui/icons-material/Help";

const Course = () => {
  const [imageURL, setImageURL] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [fileTypeList, setFileTypeList] = useState(null);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const getFileTypeList = () => {
    api
      .get(routes?.COURSE.FILE_TYPE)
      .then((res) => res?.data)
      .then((data) => {
        setFileTypeList(data?.data);
      })
      .catch((err) => apiError(err));
  };

  const loadCourseList = () => {
    api
      .get(routes?.COURSE?.LIST)
      .then((res) => res?.data)
      .then((response) => {
        setCourseList(response?.data);
        setImageURL(response?.imageUrl);
      })
      .catch((err) => apiError(err));
  };

  const deleteHandler = (courseId) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this course?",
      icon: "warning",
      cancel: true,
    }).then((willDelete) => {
      if (willDelete) {
        api
          .delete(`${routes.COURSE.DELETE}/${courseId}`, {})
          .then((res) => res.data)
          .then((data) => {
            loadCourseList();
            toast.success(data.message);
          })
          .catch((err) => apiError(err));
      }
    });
  };

  useEffect(() => {
    getFileTypeList();
    loadCourseList();
    getCourseTypeList();
  }, []);

  const getCourseTypeList = () => {
    api
      .get(`${routes?.COURSE.COURSE_TYPE.LIST}`)
      .then((res) => res.data)
      .then((response) => {
        setCourseTypeList(response?.data);
      })
      .catch((err) => apiError(err));
  };
  const [courseTypeList, setCourseTypeList] = useState([]);
  const [typeFilter, setTypeFilter] = useState(null);

  // UPDATE RANK
  const [updateRankItemId, setUpdateRankItemId] = useState(null);
  const [updateRankVal, setUpdateRankVal] = useState("");
  const updateCourseRank = async (courseId, newRank) => {
      api
        .put(routes.COURSE.UPDATE_RANK, { courseId, newRank })
        .then((res) => res.data)
        .then(() => loadCourseList())
        .catch((err) => {
          apiError(err);
        });
  };

  return (
    <Container maxWidth="xl" className={styles[`container`]}>
      <Box component={"div"} className={styles[`upper-section`]}>
        <Typography variant="h5">
          Course Details
          <Tooltip title="Help Course List">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>

        <Box width={"10rem"}>
          <FormControl fullWidth>
            <InputLabel>Course Type</InputLabel>
            <Select
              value={typeFilter}
              label="Course Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value={null}>All</MenuItem>
              {courseTypeList.map((courseType) => (
                <MenuItem value={courseType.id}>{courseType.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Link href={`/course/${0}`}>
          <Button
            className="btn"
            size="small"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Add Course
          </Button>
        </Link>
      </Box>
      <Box>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">#</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">SubTitle</StyledTableCell>
              <StyledTableCell align="center">Thumbnail</StyledTableCell>
              <StyledTableCell align="center">Banner</StyledTableCell>
              <StyledTableCell align="center">Subsription Type</StyledTableCell>
              <StyledTableCell align="center">Course Type</StyledTableCell>
              <StyledTableCell align="center">Rank</StyledTableCell>
              {/* <StyledTableCell align="center">Details</StyledTableCell> */}
              <StyledTableCell align="center">Files</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(typeFilter
              ? courseList.filter((i) => i.course_type?.id === typeFilter)
              : courseList
            )?.map((row, idx) => (
              <StyledTableRow>
                <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                <StyledTableCell align="center">{row?.title}</StyledTableCell>
                <StyledTableCell align="center">
                  {row?.subTitle}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Image
                    width={50}
                    height={50}
                    src={`${imageURL}/${row?.thumbnail}`}
                    alt="image"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Image
                    width={50}
                    height={50}
                    src={`${imageURL}/${row?.banner}`}
                    alt="image"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row?.subscriptionType}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row?.course_type?.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {updateRankItemId === row.id ? (
                      <TextField
                        style={{ width: "5rem" }}
                        label="Rank"
                        value={updateRankVal}
                        onChange={(e) => setUpdateRankVal(e.target.value)}
                      />
                    ) : (
                      row.rank
                    )}
                    <Tooltip title="Category">
                      {updateRankItemId === row.id ? (
                        <IconButton
                          onClick={async () => {
                            if (updateRankVal != row.rank) {
                              await updateCourseRank(row.id, updateRankVal);
                            }
                            setUpdateRankItemId(null);
                            setUpdateRankVal("");
                          }}
                          className="edit-icon"
                          aria-label="fingerprint"
                        >
                          <CheckIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            setUpdateRankVal(row.rank);
                            setUpdateRankItemId(row.id);
                          }}
                          className="edit-icon"
                          aria-label="fingerprint"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </Tooltip>
                  </div>
                </StyledTableCell>
                {/* <StyledTableCell align="center">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ flexShrink: 0 }}>
                        Course Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card variant="outlined">
                        <List>
                          <ListItem>
                            Heading: {row?.course_details[0]?.heading}
                          </ListItem>
                          <ListItem>
                            Description: {row?.course_details[0]?.description}
                          </ListItem>
                        </List>
                      </Card>
                    </AccordionDetails>
                  </Accordion>
                </StyledTableCell> */}

                <StyledTableCell align="center">
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ flexShrink: 0 }}>
                        File Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card variant="outlined">
                        <List>
                          <ListItem>
                            Title: {row?.course_files[0]?.title}
                          </ListItem>
                          <ListItem>
                            Description: {row?.course_files[0]?.description}
                          </ListItem>
                          <ListItem>
                            Total Time: {row?.course_files[0]?.totalTime}
                          </ListItem>
                          <ListItem>
                            Type:
                            {row?.course_files[0]?.type == 1
                              ? "Audio"
                              : "Video"}
                          </ListItem>
                          <ListItem>
                            File:{" "}
                            <>
                              {row?.course_files[0]?.type == 1 ? (
                                row?.course_files[0]?.file && <audio controls>
                                  <source
                                    src={`${routes.URL}${routes.COURSE.FILE_PATH}?filePath=${row?.course_files[0]?.file}`}
                                  />
                                </audio>
                              ) : (
                                row?.course_files[0]?.file && <video width={300} height={200} controls>
                                  <source
                                    src={`${routes.URL}${routes.COURSE.FILE_PATH}?filePath=${row?.course_files[0]?.file}`}
                                  />
                                </video>
                              )}
                            </>
                          </ListItem>
                        </List>
                      </Card>
                    </AccordionDetails>
                  </Accordion>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Tooltip title="Edit">
                    <Link href={`/course/${row?.id}`}>
                      <IconButton
                        className="edit-icon"
                        aria-label="fingerprint"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => deleteHandler(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default Course;
