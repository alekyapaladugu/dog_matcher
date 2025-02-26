import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchDogs, fetchDogsByIds, Dog } from "../api/dogService";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  Pagination,
  Chip,
} from "@mui/material";
import { DogsCard } from "./DogsCard";
import { useTheme } from "@mui/material/styles";

interface DogsFilterProps {
  breeds: string[];
  favorites: Dog[];
  setFavorites: React.Dispatch<React.SetStateAction<Dog[]>>;
}

export const DogsFilter = ({
  breeds,
  favorites,
  setFavorites,
}: DogsFilterProps) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [zipInput, setZipInput] = useState<string>("");
  const [ageMin, setAgeMin] = useState<string | "">("");
  const [ageMax, setAgeMax] = useState<string | "">("");
  const [sortOrder, setSortOrder] = useState<string>("breed:asc");
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const theme = useTheme();

  const { data: searchResults } = useQuery({
    queryKey: [
      "dogs",
      selectedBreeds,
      zipCodes,
      ageMin,
      ageMax,
      sortOrder,
      page,
    ],
    queryFn: () =>
      searchDogs({
        breeds: selectedBreeds,
        zipCodes: zipCodes.length ? zipCodes : [],
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        size: 10,
        from: (page - 1) * 10,
        sort: sortOrder,
      }),
  });

  const { data: dogs, isLoading: dogsLoading } = useQuery({
    queryKey: ["dogDetails", searchResults?.resultIds],
    queryFn: () => fetchDogsByIds(searchResults?.resultIds || []),
    enabled: !!searchResults?.resultIds?.length,
  });

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === dog.id)
        ? prevFavorites.filter((fav) => fav.id !== dog.id)
        : [...prevFavorites, dog]
    );
  };

  const handleSelectionChange = (event: any, type: "breeds" | "zipCodes") => {
    const value = event.target.value;
    if (type === "breeds") {
      setSelectedBreeds(
        typeof value === "string"
          ? value.split(",").map((b) => b.trim())
          : value
      );
      setOpenDropdown(false);
    } else {
      setZipInput(
        typeof value === "string"
          ? value.split(",").map((z) => z.trim())
          : value
      );
    }
  };

  const handleZipInputSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && zipInput) {
      event.preventDefault();
      const newZipCodes = zipInput;
      setZipCodes(
        [...zipCodes, ...newZipCodes].filter(
          (z, i, arr) => arr.indexOf(z) === i
        )
      );
      setZipInput("");
    }
  };

  const handleDeleteSelection = (item: string, type: "breeds" | "zipCodes") => {
    if (type === "breeds") {
      setSelectedBreeds(selectedBreeds.filter((b) => b !== item));
    } else {
      setZipCodes(zipCodes.filter((z) => z !== item));
    }
    setPage(1);
  };

  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{ mt: 3, mb: 3 }}
        gutterBottom
      >
        Search and Filter Dogs
      </Typography>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <Select
        multiple
        value={selectedBreeds}
        onChange={(e) => handleSelectionChange(e, "breeds")}
        open={openDropdown}
        onOpen={() => setOpenDropdown(true)}
        onClose={() => setOpenDropdown(false)}
        fullWidth
        displayEmpty
        renderValue={(selected) => (
          <Typography
            sx={(theme) => ({
              color:
                selected.length === 0 ? theme.palette.text.disabled : "inherit",
              opacity: 1,
            })}
          >
            {selected.length === 0 ? "Select Breeds" : selected.join(", ")}
          </Typography>
        )}
      >
        {breeds?.map((breed: string) => (
          <MenuItem key={breed} value={breed}>
            {breed}
          </MenuItem>
        ))}
      </Select>
      {selectedBreeds.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
          {selectedBreeds.map((breed) => (
            <Chip
              key={breed}
              label={breed}
              onDelete={() => handleDeleteSelection(breed, "breeds")}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      )}

      <TextField
        label="Enter Zip Codes (comma-separated)"
        value={zipInput}
        onChange={(e) => handleSelectionChange(e, "zipCodes")}
        onKeyDown={handleZipInputSubmit}
        fullWidth
        margin="normal"
        placeholder="Type zip codes and press Enter"
      />
      {zipCodes.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
          {zipCodes.map((zip) => (
            <Chip
              key={zip}
              label={zip}
              onDelete={() => handleDeleteSelection(zip, "zipCodes")}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      )}

      <TextField
        label="Min Age"
        type="number"
        value={ageMin}
        onChange={(e) => setAgeMin(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Max Age"
        type="number"
        value={ageMax}
        onChange={(e) => setAgeMax(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box
        margin="normal"
        sx={{ width: "100%", "margin-top": "16px", "margin-bottom": "8px" }}
      >
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          fullWidth
        >
          <MenuItem value="breed:asc">Breed A-Z</MenuItem>
          <MenuItem value="breed:desc">Breed Z-A</MenuItem>
          <MenuItem value="name:asc">Dog Name A-Z</MenuItem>
          <MenuItem value="name:desc">Dog Name Z-A</MenuItem>
          <MenuItem value="age:asc">Age Ascending</MenuItem>
          <MenuItem value="age:desc">Age Descending</MenuItem>
        </Select>
      </Box>
      {dogsLoading && <Loader />}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={2}
        sx={{ mt: 2 }}
      >
        {dogs?.map((dog) => (
          <DogsCard
            key={dog.id}
            dog={dog}
            isFavorite={favorites.some((fav) => fav.id === dog.id)}
            onFavoriteToggle={handleFavorite}
          />
        ))}
      </Box>
      {searchResults?.total !== undefined && searchResults?.total > 0 ? (
        <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil((searchResults?.total || 10) / 10)}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{ mt: 2 }}
            className="text-center"
          />
        </Box>
      ) : null}
    </Container>
  );
};
