import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Box } from "@mui/material";
import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, useTheme } from "@mui/material/styles";
import { TfiHelp } from "react-icons/tfi";
import { TfiBook } from "react-icons/tfi";
import { TfiClose } from "react-icons/tfi";
import { TfiSettings } from "react-icons/tfi";
import { AiOutlineAudit } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import StyleIcon from '@mui/icons-material/Style';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import minilogo from "../../assets/logo/favicon.png";
import styles from "../../styles/sidebar.module.scss";

const drawerWidth = 240;

const closedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const openedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	marginLeft: drawerWidth,
	width: `calc(100% - ${drawerWidth}px)`,
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - 65px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));


export default function MiniDrawer(props) {

	const { isDrawerOpen, setIsDrawerOpen } = props;
	const theme = useTheme();
	const router = useRouter();

	const [open, setOpen] = React.useState(false);
	const [shrink, setShrink] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const openMenu = Boolean(anchorEl);

	const Rightlogo = Cookies.get("logo");
	const username = Cookies.get("username") ? Cookies.get("username") : "H";

	const handleDrawerOpen = () => {
		setOpen(true);
		setIsDrawerOpen(true);
		setShrink(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
		setIsDrawerOpen(false);
		setShrink(false);
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<CssBaseline />
			<AppBar position="fixed" open={open} className={styles.appBar}>
				<Toolbar
					sx={{ minHeight: "55px !important" }}
					className={styles.ToolbarHeader}
				>
					<IconButton
						onClick={handleDrawerClose}
						aria-label="open drawer"
						sx={{
							marginRight: 5,
							...(!open && { display: "none" }),
						}}
						className={styles.closeMenuIcon}
					>
						{theme.direction === "rtl" ? <TfiClose /> : <TfiClose />}
					</IconButton>

					<IconButton
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: "none" }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Box className={styles.InfoBar}>
						<Box className={styles.Midinfobar}>
							<Link href="/settings">
								<Tooltip title="Setting" placement="bottom">
									<Button>
										<TfiSettings></TfiSettings>
									</Button>
								</Tooltip>
							</Link>
						</Box>

						<Box className={styles.Midinfobar}>
							<Link href="/guide">
								<Tooltip title="Guide" placement="bottom">
									<Button>
										<TfiBook></TfiBook>
									</Button>
								</Tooltip>
							</Link>
						</Box>
						<Box className={styles.Midinfobar}>
							<Link href="/">
								<Tooltip title="Help" placement="top-start">
									<Button>
										<TfiHelp></TfiHelp>
									</Button>
								</Tooltip>
							</Link>
						</Box>
						<Box>
							<Button
								id="basic-button"
								aria-controls={open ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								onClick={handleClick}
								className={styles.TopRightDropBtn}
							>
								<Box className={styles.CompLogo}>
									{Rightlogo && Rightlogo.length && (
										<Link style={{color: 'inherit'}} href={'/'}>
											<Typography>LOGO</Typography>
										</Link>
										// <Image
										// 	alt="right logo"
										// 	layout="fill"
										// 	width={100}
										// 	height={100}
										// 	src={Rightlogo}
										// />
									)}
								</Box>
								<Box className={styles.NameRight}>
									<Typography component="p">
										{username[0].toUpperCase()}
									</Typography>
								</Box>
							</Button>
							<Menu
								id="basic-menu"
								anchorEl={anchorEl}
								open={openMenu}
								onClose={handleClose}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
							>
								<Box className={styles.DropDownMenuItem}>
									<Box className={styles.NamePro}>
										<Typography component="p">Hi, {username}</Typography>
									</Box>
									<MenuItem onClick={handleClose}>
										<Link href="/settings">
											<Box component="a">
												<IoSettingsOutline className={styles.icon} />
												<span>Settings</span>
											</Box>
										</Link>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<Link href="/audit-logs">
											<Box component="a">
												<AiOutlineAudit className={styles.icon} />
												<span>Audit Log </span>
											</Box>
										</Link>
									</MenuItem>

									<MenuItem onClick={handleClose}>
										<Link href="/logout">
											<Box component="a">
												<IoLockClosedOutline className={styles.icon} />
												<span>Logout</span>
											</Box>
										</Link>
									</MenuItem>
								</Box>
							</Menu>
						</Box>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				open={open}
				className={shrink ? styles.shrinkSidebar : styles.sidebar}
				sx={{
					"& .MuiPaper-root": {
						backgroundColor: "#251404",
						
					},
				}}
			>
				<DrawerHeader>
					<Box className={styles.logoBox}>
						{!isDrawerOpen ? (
							// <Image alt="logo" src={logo} height={40} width={40} />

						<Link style={{color: 'inherit'}} href={'/'}><Typography>LOGO</Typography></Link>	
						) : (
							<Box className={styles.miniimage}>
								{/* <Image height={40} width={40} alt="mini logo" src={minilogo} /> */}
							</Box>
						)}
					</Box>
				</DrawerHeader>
				<List id="sidebarMenu">
					<>
						<Box className={styles.DividerHeding}>
							<Typography
								component="p"
								className={isDrawerOpen ? styles.mainmenu : ""}
							>
								Main Menu
							</Typography>
						</Box>
						<ListItem disablePadding className={router.pathname === "/welcome" ? styles.active : ""}>
							<Link href="/welcome">
								<CardGiftcardIcon className={styles.icon} />
								<span>Welcome</span>
							</Link>
						</ListItem>
						<ListItem disablePadding className={router.pathname === "/question" ? styles.active : ""}>
							<Link href="/question">
								<ListAltIcon className={styles.icon} />
								<span>Question</span>
							</Link>
						</ListItem>
						<ListItem disablePadding className={router.pathname === "/course" ? styles.active : ""}>
							<Link href="/course">
								<StyleIcon className={styles.icon} />
								<span>Course</span>
							</Link>
						</ListItem>
						<ListItem disablePadding className={router.pathname === "/course-type" ? styles.active : ""}>
							<Link href="/course-type">
								<CardGiftcardIcon className={styles.icon} />
								<span>Course Type</span>
							</Link>
						</ListItem>
					</>
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 0, height: "55px" }}>
				<DrawerHeader />
			</Box>
			<ToastContainer />
		</div>
	);
}
