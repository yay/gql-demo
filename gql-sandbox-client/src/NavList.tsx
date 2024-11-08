import React, { type FC, useMemo } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";

export type NavListProps = {
	routes: {
		name?: string;
		path: string;
	}[];
};

export const NavList: FC<NavListProps> = ({ routes }) => {
	const theme = useTheme();
	const linkCls = useMemo(() => {
		return css`
      text-decoration: none;
      color: ${theme.palette.text.primary};
    `;
	}, [theme.palette.text.primary]);

	return (
		<List sx={{ padding: 0 }}>
			{routes.map(({ name, path }) => (
				<Link key={path} to={path} className={linkCls}>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText primary={name || path} />
						</ListItemButton>
					</ListItem>
				</Link>
			))}
		</List>
	);
};
