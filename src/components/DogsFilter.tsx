import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { searchDogs, fetchDogsByIds, Dog } from "../api/dogService";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import { Container, Typography, Box, Pagination, Chip } from "@mui/material";
import { DogsCard } from "./DogsCard";
import FilterDropdown from "./FilterDropdown";
import SortByDropdown from "./SortByDropdown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface DogsFilterProps {
  breeds: string[];
  favorites: Dog[];
  setFavorites: React.Dispatch<React.SetStateAction<Dog[]>>;
}

export interface Filters {
  selectedBreeds: string[];
  zipCodes: number[];
  ageMin: string | number;
  ageMax: string | number;
  sortOrder: string;
}

export const DogsFilter = ({
  breeds,
  favorites,
  setFavorites,
}: DogsFilterProps) => {
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [dogsDetails, setDogDetails] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<Filters>({
    selectedBreeds: [],
    zipCodes: [],
    ageMin: "",
    ageMax: "",
    sortOrder: "breed:asc",
  });

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

  const {
    data: searchResults,
    isError: isSearchResError,
    isLoading: searchResLoading,
    error: searchResError,
  } = useQuery({
    queryKey: ["dogs", filters, page],
    queryFn: () =>
      searchDogs({
        breeds: filters.selectedBreeds.length ? filters.selectedBreeds : [],
        zipCodes: filters.zipCodes.length ? filters.zipCodes : [],
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
        size: 10,
        from: (page - 1) * 10,
        sort: filters.sortOrder,
      }),
  });

  const dogDetailsMutation = useMutation({
    mutationFn: fetchDogsByIds,
    onSuccess: (data: Dog[]) => setDogDetails(data),
  });

  useEffect(() => {
    if (searchResults?.resultIds && searchResults?.resultIds?.length > 0) {
      dogDetailsMutation.mutate(searchResults?.resultIds ?? []);
    }
  }, [searchResults]);

  useEffect(() => {
    if (isSearchResError) {
      setError(`Filtering of Dogs failed: ${searchResError.message}`);
    }
    if (dogDetailsMutation?.isError) {
      setError(
        `Fetching of Dog Details failed: ${dogDetailsMutation?.error?.message}`
      );
    }
  }, [isSearchResError, dogDetailsMutation?.isError]);

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === dog.id)
        ? prevFavorites.filter((fav) => fav.id !== dog.id)
        : [...prevFavorites, dog]
    );
  };

  const handleFilterChange = (updatedFilters: Object) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPage(1);
  };

  const getSortLabel = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    return option ? option.label : "Breed (A-Z)";
  };

  const handleDeleteSelection = (
    filter_name: string,
    value: string | string[] | number[]
  ) => {
    setFilters({ ...filters, [filter_name]: value });
    setPage(1);
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
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

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
          onDelete={() => handleDeleteSelection("sortOrder", "breed:asc")}
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

      {(searchResLoading || dogDetailsMutation?.isPending) && <Loader />}
      {searchResults?.total === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 5 }} gutterBottom>
          No dogs found. Please try adjusting your filters.
        </Typography>
      )}
      {dogsDetails && dogsDetails?.length === 1 ? (
        <Box sx={{ maxWidth: 400, margin: "auto" }}>
          {dogsDetails?.map((dog) => (
            <DogsCard
              key={dog.id}
              dog={dog}
              isFavorite={favorites.some((fav) => fav.id === dog.id)}
              onFavoriteToggle={handleFavorite}
            />
          ))}
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={2}
          sx={{ mt: 2 }}
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
      )}

      {searchResults?.total && searchResults?.total > 0 ? (
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
