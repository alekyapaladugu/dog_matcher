import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchBreeds,
  Dog,
  searchDogs,
  fetchDogsByIds,
} from "../api/dogService";
import ErrorModal from "../components/ErrorModal";
import { Container, Tabs, Tab, Box } from "@mui/material";
import { DogsFilter } from "../components/DogsFilter";
import { Favorites } from "../components/Favorites";
import Header from "../components/Header";

export interface Filters {
  selectedBreeds: string[];
  zipCodes: string[];
  ageMin: string;
  ageMax: string;
  sortOrder: string;
}

const Dogs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dogsDetails, setDogDetails] = useState<Dog[]>([]);
  const [filters, setFilters] = useState<Filters>({
    selectedBreeds: [],
    zipCodes: [],
    ageMin: "",
    ageMax: "",
    sortOrder: "breed:asc",
  });
  const [page, setPage] = useState<number>(1);

  const {
    data: breeds,
    isError: isBreedsError,
    error: breedsError,
  } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
    retry: 3,
  });

  const {
    data: searchResults,
    isError: isSearchResError,
    error: searchResError,
  } = useQuery({
    queryKey: ["dogs", filters, { page }],
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
      dogDetailsMutation.mutate(searchResults?.resultIds);
    } else {
      setDogDetails([]);
    }
  }, [searchResults]);

  useEffect(() => {
    if (isBreedsError) {
      setError(`Loading of Breeds Failed: ${breedsError?.message}`);
    }
    if (isSearchResError) {
      setError(`Filtering of Dogs failed: ${searchResError.message}`);
    }
    if (dogDetailsMutation?.isError) {
      setError(
        `Fetching of Dog Details failed: ${dogDetailsMutation?.error?.message}`
      );
    }
  }, [isBreedsError, isSearchResError, dogDetailsMutation?.isError]);

  const handleFilterChange = (updatedFilters: Partial<Filters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPage(1);
  };

  const handleDeleteSelection = (
    filter_name: keyof Filters,
    value: Filters[typeof filter_name]
  ) => {
    setFilters({ ...filters, [filter_name]: value });
    setPage(1);
  };

  return (
    <>
      <Header />
      <Container>
        {error && <ErrorModal message={error} onClose={() => setError(null)} />}
        <Box sx={{ p: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
          >
            <Tab label="Search Dogs" />
            <Tab label="Favorite Dogs" />
          </Tabs>
        </Box>
        {tabIndex === 0 && (
          <DogsFilter
            breeds={breeds || []}
            filters={filters}
            dogsDetails={dogsDetails}
            dogDetailsPending={dogDetailsMutation.isPending}
            favorites={favorites}
            setFavorites={setFavorites}
            handleFilterChange={handleFilterChange}
            handleDeleteSelection={handleDeleteSelection}
            page={page}
            setPage={setPage}
            searchResults={searchResults}
          />
        )}
        {tabIndex === 1 && (
          <Favorites favorites={favorites} setFavorites={setFavorites} />
        )}
      </Container>
    </>
  );
};

export default Dogs;
