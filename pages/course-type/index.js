import * as React from "react";
import Swal from "sweetalert";
import {
  Container,
  Paper,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import routes from "../../utils/routes";
import api from "../../utils/api";
import { apiError } from "../../utils/error";
import styles from "../../styles/course-type.module.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListIcon from "@mui/icons-material/List";
import HelpIcon from "@mui/icons-material/Help";

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

export default function CourseType() {
  const [courseTypeList, setCourseTypeList] = React.useState([]);

  const loadCourseTypeList = () => {
    api
      .get(routes.COURSE.COURSE_TYPE.LIST)
      .then((res) => res.data)
      .then((data) => {
        setCourseTypeList(data.data);
        setImageURL(data?.imageUrl);
      })
      .catch((err) => apiError(err));
  };

  React.useEffect(() => {
    loadCourseTypeList();
  }, []);

  const deleteHandler = (courseTypeId) => {
    Swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this course type?",
      icon: "warning",
      cancel: true,
    }).then((willDelete) => {
      if (willDelete) {
        api
          .delete(`${routes.COURSE.COURSE_TYPE.DELETE}/${courseTypeId}`, {})
          .then((res) => res.data)
          .then((data) => {
            loadCourseTypeList();
            toast.success(data.message);
          })
          .catch((err) => apiError(err));
      }
    });
  };

  return (
    <Container maxWidth={"xl"} className={styles.container}>
      <Box component={"div"} className={styles["upper-section"]}>
        <Typography variant="h5">
          Course Types{" "}
          <Tooltip title="Help Course Types List">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>
        {/* <Link href={`/course-type/${0}`}>
          <Button
            className="btn"
            size="small"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Add Course Type
          </Button>
        </Link> */}
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">#</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseTypeList?.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                <StyledTableCell align="center">{row.name}</StyledTableCell>
                <StyledTableCell align="center">
                  <Box>
                    <Tooltip title="Category">
                      <Link href={`/course-type/${row.id}/categories`}>
                        <IconButton
                          className="edit-icon"
                          aria-label="fingerprint"
                        >
                          <ListIcon />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    {/* <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => deleteHandler(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip> */}
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
