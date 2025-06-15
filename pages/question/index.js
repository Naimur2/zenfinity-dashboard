import * as React from "react";
import Swal from "sweetalert";
import {
  Container,
  Paper,
  Box,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  Typography,
  CardHeader,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from "../../styles/question.module.scss";
import api from "../../utils/api";
import routes from "../../utils/routes";
import { apiError } from "../../utils/error";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

export default function Question() {
  const [imageURL, setImageURL] = useState("");
  const [questionList, setQuestionList] = React.useState([]);

  const loadQuestionList = () => {
    api
      .get(routes.QUESTIONS.LIST)
      .then((res) => res.data)
      .then((data) => {
        setQuestionList(data.data);
        setImageURL(data?.imageUrl);
      })
      .catch((err) => apiError(err));
  };

  React.useEffect(() => {
    loadQuestionList();
  }, []);

  const deleteQuestion = (questionId) => {
    Swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this question?",
      icon: "warning",
      cancel: true,
    }).then((willDelete) => {
      if (willDelete) {
        api
          .delete(`${routes.QUESTIONS.DELETE}/${questionId}`, {})
          .then((res) => res.data)
          .then((data) => {
            loadQuestionList();
            toast.success(data.message);
          })
          .catch((err) => apiError(err));
      }
    });
  };

  return (
    <Container maxWidth={"xl"} className={styles[`container`]}>
      <Box component={"div"} className={styles[`upper-section`]}>
        <Typography variant="h5">
          Question List
          <Tooltip title="Help Course Type">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>
        <Link href={`/question/${0}`}>
          <Button
            className="btn"
            size="small"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Add Question
          </Button>
        </Link>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Question</StyledTableCell>
              <StyledTableCell>Answer</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionList?.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell>{idx + 1}</StyledTableCell>
                <StyledTableCell>{row?.question}</StyledTableCell>
                <StyledTableCell>
                  <ul className={styles[`list`]}>
                    {row?.answers?.map((answer, idx) => {
                      return (
                        <li key={idx}>
                          <CardHeader
                            avatar={
                              <Avatar
                                sx={{ width: 20, height: 20 }}
                                src={`${imageURL}/${answer?.icon}`}
                              />
                            }
                            title={answer?.answer}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </StyledTableCell>

                <StyledTableCell>
                  <Box>
                    <Tooltip title="Edit">
                      <Link href={`/question/${row?.id}`}>
                        <IconButton className="edit-icon" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => deleteQuestion(row?.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
