import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Menu,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Filters } from "./DogsFilter";
import FilterListIcon from "@mui/icons-material/FilterList";

interface FilterDropdownProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  breeds: string[];
}

const FilterDropdown = ({
  filters,
  setFilters,
  breeds,
}: FilterDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [zipInput, setZipInput] = useState<string>("");

  useEffect(() => {
    setTempFilters(filters);
    setZipInput(filters?.zipCodes.join(", "));
  }, [filters]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (
    key: keyof Filters,
    value: Filters[typeof key]
  ) => {
    setTempFilters((prev: Filters) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleZipInput = (value: string) => {
    value = value.replace(/[^0-9,]/g, ""); // Remove non-numeric characters

    setZipInput(value);
    let zipInputs_split = value
      .split(",")
      .map((z: string) => {
        if (z.length === 5) {
          return z.trim();
        }
      })
      .filter((z) => z) as string[];

    handleFilterChange("zipCodes", zipInputs_split);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleOpen}
      >
        Filter By
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Filters
          </Typography>

          {/* Breeds Selection */}
          <Typography variant="body2">Breed</Typography>
          <Select
            multiple
            value={tempFilters.selectedBreeds}
            onChange={(e) => {
              handleFilterChange("selectedBreeds", e.target.value);
              setOpenDropdown(false);
            }}
            fullWidth
            displayEmpty
            sx={{ mb: 2 }}
            open={openDropdown}
            onOpen={() => setOpenDropdown(true)}
            onClose={() => setOpenDropdown(false)}
            renderValue={(selected) => (
              <Typography
                sx={(theme) => ({
                  color:
                    selected.length === 0
                      ? theme.palette.text.disabled
                      : "inherit",
                  opacity: 1,
                })}
              >
                {selected.length === 0 ? "Select Breeds" : selected.join(", ")}
              </Typography>
            )}
          >
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2">
            Enter zip codes (comma separated)
          </Typography>
          <TextField
            fullWidth
            placeholder="Zip Codes"
            value={zipInput}
            onChange={(e) => handleZipInput(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2">Min Age</Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="Min Age"
            value={tempFilters.ageMin}
            onChange={(e) => handleFilterChange("ageMin", e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2">Max Age</Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="Max Age"
            value={tempFilters.ageMax}
            onChange={(e) => handleFilterChange("ageMax", e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Apply Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => {
              setFilters(tempFilters);
              handleClose();
            }}
          >
            Apply
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default FilterDropdown;
