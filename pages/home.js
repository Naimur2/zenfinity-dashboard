import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Container,
  Grid,
  CardHeader,
  Button,
  Divider,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Group from "@mui/icons-material/Group";
import Refresh from "@mui/icons-material/Refresh";
import { BarChart } from "@mui/x-charts/BarChart";

import styles from "../styles/course-type.module.scss";
import api from "../utils/api";
import routes from "../utils/routes";
import { apiError } from "../utils/error";

export default function Home(props) {
  const [data, setData] = React.useState([]);

  const loadDashbaordData = () => {
    api
      .get(routes.DASHBOARD.LIST)
      .then((res) => res.data)
      .then((data) => {
        setData(data);
      })
      .catch((err) => apiError(err));
  };

  React.useEffect(() => {
    loadDashbaordData();
  }, []);

  return (
    <Container maxWidth={"xl"} className={styles.container}>
      <Grid container spacing={3} padding={3}>
        <Grid lg={3} sm={6} xs={12}>
          <CustomCard
            sx={{ height: "100%" }}
            title="Total Users"
            value={data.totalUser}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <CustomCard
            sx={{ height: "100%" }}
            title="Total Completed Sessions"
            value={data.totalCompletedSession}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <CustomCard
            sx={{ height: "100%" }}
            title="Total Completed Sessions Seconds"
            value={data.totalCompletedSessionSec}
          />
        </Grid>
      </Grid>
      <Grid lg={8} xs={12} padding={3}>
        <CustomChart sx={{ height: "100%" }} data={data.resultArray} />
      </Grid>
    </Container>
  );
}

export function CustomCard({ sx, title, value }) {
  return (
    <Card
      sx={sx}
      style={{ margin: "1rem", border: "1px solid grey", borderRadius: "1rem" }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="#667085"
              variant="overline"
              style={{ lineHeight: "20px" }}
            >
              {title}
            </Typography>
            <Typography variant="h4">{value?.toString?.() || "-"}</Typography>
          </Stack>
          <Avatar
            sx={{ backgroundColor: "#635bff", height: "56px", width: "56px" }}
          >
            <Group style={{ fontSize: "1.5rem" }} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function CustomChart({
  data = [{ question: { question: "Loading..." }, answers: [{answerCount: 0}] }],
  sx,
}) {

  const xAxis = data?.map(i => i.question.question);
  const yAxis = data?.map(i => ({data: i.answers.map(j => j.answerCount ), toolTip: 'ad'}))

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<Refresh style={{ fontSize: "1rem" }} />}
          >
            Sync
          </Button>
        }
        title="Question Answers"
      />
      <CardContent>
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <BarChart
            xAxis={[
              { scaleType: "band", data: xAxis },
            ]}
            series={yAxis}
            height={400}
          />
        </Stack>
        <Divider />
      </CardContent>
    </Card>
  );
}
