import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBreeds, Dog } from "../api/dogService";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import { Container, Tabs, Tab, Box } from "@mui/material";
import { DogsFilter } from "../components/DogsFilter";
import { Favorites } from "../components/Favorites";
import Header from "../components/Header";

const Dogs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [breedsError, setBreedsError] = useState<string | null>(null);

  const {
    data: breeds,
    isLoading: breedsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
    retry: 3,
  });

  useEffect(() => {
    if (isError) {
      setBreedsError(`Loading of Breeds Failed: ${error?.message}`);
    }
  }, [isError]);

  return (
    <>
      <Header />
      <Container>
        {breedsLoading && <Loader />}
        {breedsError && (
          <ErrorModal
            message={breedsError}
            onClose={() => setBreedsError(null)}
          />
        )}
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
            favorites={favorites}
            setFavorites={setFavorites}
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
