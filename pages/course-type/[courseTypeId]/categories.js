import * as React from "react";
import {
  Container,
  Paper,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import routes from "../../../utils/routes";
import api from "../../../utils/api";
import { apiError } from "../../../utils/error";
import styles from "../../../styles/course-type.module.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import HelpIcon from "@mui/icons-material/Help";
import { useRouter } from "next/router";

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

export default function CategoryList() {
  const router = useRouter();

  const [categoryList, setCategoryList] = React.useState([]);

  const courseTypeId = router.query.courseTypeId;

  const [editItem, setEditItem] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");

  const loadCategoryList = () => {
    api
      .get(`${routes.COURSE.COURSE_TYPE.CATEGORY.LIST}/${courseTypeId}`)
      .then((res) => res.data)
      .then((data) => {
        setCategoryList(data.data);
      })
      .catch((err) => apiError(err));
  };

  React.useEffect(() => {
    loadCategoryList();
  }, []);

  // UPDATE
  const updateCategoryName = (id, newName) => {
    return new Promise((resolve, reject) => {
      api
        .put(routes.COURSE.COURSE_TYPE.CATEGORY.UPDATE, {id, name: newName})
        .then((res) => res.data)
        .then(() => loadCategoryList())
        .then(() => resolve())
        .catch((err) => {
          apiError(err)
          reject()
        });
    })
  }

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
            {categoryList?.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  {editItem === row.id ? 
                  <TextField  label="Name" variant="outlined" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                  : row.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Box>
                    <Tooltip title="Category">
                      <IconButton
                        onClick={async () => {
                          if (editItem === row.id) {
                            if (editValue != row.name){
                              await updateCategoryName(row.id, editValue);
                            }
                            setEditItem(null);
                            setEditValue('');
                          } else {
                            setEditValue(row.name);
                            setEditItem(row.id);
                          }
                        }}
                        className="edit-icon"
                        aria-label="fingerprint"
                      >
                        {editItem === row.id ? <CheckIcon /> : <EditIcon />}
                      </IconButton>
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
