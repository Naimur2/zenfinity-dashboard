import { useState, useEffect } from "react";
import Swal from "sweetalert";
import {
  Container,
  Grid,
  Paper,
  Box,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  Typography,
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
import Image from "next/image";
import api from "../../utils/api";
import routes from "../../utils/routes";
import { apiError } from "../../utils/error";
import styles from "../../styles/weclome.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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

export default function Welcome() {
  const [imageURL, setImageURL] = useState("");
  const [welcomeList, setWelcomeList] = useState([]);

  const loadWelcomeList = () => {
    api
      .get(routes.WELCOME.LIST)
      .then((res) => res.data)
      .then((data) => {
        setWelcomeList(data.data);
        setImageURL(data?.imageUrl);
      })
      .catch((err) => apiError(err));
  };

  useEffect(() => {
    loadWelcomeList();
  }, []);

  const deleteWelcome = (welcomeId) => {
    Swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this welcome?",
      icon: "warning",
      cancel: true,
    }).then((willDelete) => {
      if (willDelete) {
        api
          .delete(`${routes.WELCOME.DELETE}/${welcomeId}`, {})
          .then((res) => res.data)
          .then((data) => {
            loadWelcomeList();
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
          Welcome
          <Tooltip title="Help Welcome List">
            <HelpIcon
              fontSize="large"
              style={{ verticalAlign: "middle" }}
              className="help-icon"
            />
          </Tooltip>
        </Typography>
        <Link href={`/welcome/${0}`}>
          <Button
            className="btn"
            size="small"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Add New
          </Button>
        </Link>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">#</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Color Text</StyledTableCell>
              <StyledTableCell align="center">Step</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Image</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {welcomeList?.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title={row?.color ? row?.color : "No color"}>
                    <Box
                      sx={{
                        bgcolor: row?.color,
                        height: "30px",
                      }}
                    ></Box>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.colorText}
                </StyledTableCell>
                <StyledTableCell align="center">{row.step}</StyledTableCell>
                <StyledTableCell align="center">{row.title}</StyledTableCell>
                <StyledTableCell align="center">
                  <Image
                    width={50}
                    height={50}
                    src={`${imageURL}/${row?.image}`}
                    alt="image"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Box>
                    <Tooltip title="Edit">
                      <Link href={`/welcome/${row?.id}`}>
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
                        onClick={() => deleteWelcome(row.id)}
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
