import { Dog } from "../api/dogService";
import Loader from "../components/Loader";
import { Container, Typography, Box, Pagination, Chip } from "@mui/material";
import { DogsCard } from "./DogsCard";
import FilterDropdown from "./FilterDropdown";
import SortByDropdown from "./SortByDropdown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Filters } from "../pages/Dogs";

interface DogsFilterProps {
  breeds: string[];
  filters: Filters;
  dogsDetails: Dog[];
  dogDetailsPending: boolean;
  favorites: Dog[];
  setFavorites: React.Dispatch<React.SetStateAction<Dog[]>>;
  handleFilterChange: (updatedFilters: Partial<Filters>) => void;
  handleDeleteSelection: (
    filter_name: keyof Filters,
    value: Filters[typeof filter_name]
  ) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  searchResults:
    | {
        resultIds: string[];
        total: number;
        next?: string | undefined;
        prev?: string | undefined;
      }
    | undefined;
}

export const DogsFilter = ({
  breeds,
  filters,
  dogsDetails,
  dogDetailsPending,
  favorites,
  setFavorites,
  handleFilterChange,
  handleDeleteSelection,
  page,
  setPage,
  searchResults,
}: DogsFilterProps) => {
  const sortOptions = [
    { label: "Breed (A-Z)", value: "breed:asc", icon: <ArrowUpwardIcon /> },
    { label: "Breed (Z-A)", value: "breed:desc", icon: <ArrowDownwardIcon /> },
    { label: "Dog Name (A-Z)", value: "name:asc", icon: <ArrowUpwardIcon /> },
    {
      label: "Dog Name (Z-A)",
      value: "name:desc",
      icon: <ArrowDownwardIcon />,
    },
    {
      label: "Age (Youngest First)",
      value: "age:asc",
      icon: <ArrowUpwardIcon />,
    },
    {
      label: "Age (Oldest First)",
      value: "age:desc",
      icon: <ArrowDownwardIcon />,
    },
  ];

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === dog.id)
        ? prevFavorites.filter((fav) => fav.id !== dog.id)
        : [...prevFavorites, dog]
    );
  };

  const getSortLabel = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    return option ? option.label : "Breed (A-Z)";
  };

  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        sx={(theme) => ({
          mt: 3,
          mb: 3,
          fontWeight: 700,
          color: theme.palette.primary.main,
        })}
        gutterBottom
      >
        Search Dogs
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <SortByDropdown
          sortOrder={filters?.sortOrder}
          setSortOrder={(value) => handleFilterChange({ sortOrder: value })}
          sortOptions={sortOptions}
        />
        <FilterDropdown
          filters={filters}
          setFilters={handleFilterChange}
          breeds={breeds}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Chip
          label={`Sorted by: ${getSortLabel(filters.sortOrder)}`}
          onDelete={
            filters.sortOrder !== "breed:asc"
              ? () => handleDeleteSelection("sortOrder", "breed:asc")
              : undefined
          }
        />
        {filters?.selectedBreeds?.map((breed) => (
          <Chip
            key={breed}
            label={breed}
            onDelete={() =>
              handleDeleteSelection(
                "selectedBreeds",
                filters?.selectedBreeds?.filter((b) => b !== breed)
              )
            }
          />
        ))}

        {filters?.zipCodes.map((zip) => (
          <Chip
            key={zip}
            label={zip}
            onDelete={() =>
              handleDeleteSelection(
                "zipCodes",
                filters.zipCodes.filter((z) => z !== zip)
              )
            }
          />
        ))}
        {filters.ageMin && (
          <Chip
            label={`Min Age: ${filters.ageMin}`}
            onDelete={() => handleDeleteSelection("ageMin", "")}
          />
        )}
        {filters.ageMax && (
          <Chip
            label={`Max Age: ${filters.ageMax}`}
            onDelete={() => handleDeleteSelection("ageMax", "")}
          />
        )}
      </Box>

      {searchResults?.total === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 5 }} gutterBottom>
          No dogs found. Please try adjusting your filters.
        </Typography>
      )}
      {dogDetailsPending && <Loader />}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            dogsDetails.length === 1
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
          maxWidth: dogsDetails.length === 1 ? 400 : "100%",
          margin: dogsDetails.length === 1 ? "auto" : 0,
          gap: 2,
          mt: 2,
        }}
      >
        {dogsDetails?.map((dog) => (
          <DogsCard
            key={dog.id}
            dog={dog}
            isFavorite={favorites.some((fav) => fav.id === dog.id)}
            onFavoriteToggle={handleFavorite}
          />
        ))}
      </Box>

      {dogsDetails && searchResults?.total && searchResults?.total > 0 ? (
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
