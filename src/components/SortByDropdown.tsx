import { MenuItem, ListItemIcon, Box, Button, Menu } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

import { JSX, useState } from "react";

interface SortByDropdownProps {
  sortOrder: string;
  setSortOrder: (value: string) => void;
  sortOptions: { label: string; value: string; icon: JSX.Element }[];
}

const SortByDropdown = ({
  sortOrder,
  setSortOrder,
  sortOptions,
}: SortByDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    handleClose();
  };

  return (
    <Box>
      <Button variant="outlined" startIcon={<SortIcon />} onClick={handleOpen}>
        Sort By
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SortByDropdown;
