import { Box } from "@mui/material";
import React from "react"

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

export function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return(
        <div
            role = "tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-lablledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p:3}}>{children}</Box>}
        </div>
    );
}

export default TabPanel;
