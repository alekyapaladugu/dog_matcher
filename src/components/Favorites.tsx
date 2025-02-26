import { useState } from "react";
import { Dog, getMatch } from "../api/dogService";
import { Box, Button, Container, Typography } from "@mui/material";
import { DogsCard } from "./DogsCard";
import ErrorModal from "../components/ErrorModal";
import Loader from "./Loader";

interface FavoriteDogsProps {
  favorites: Dog[];
  setFavorites: React.Dispatch<React.SetStateAction<Dog[]>>;
}

export const Favorites = ({ favorites, setFavorites }: FavoriteDogsProps) => {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFindMatch = async () => {
    if (favorites.length === 0) return;
    setLoading(true);
    try {
      const matchResult = await getMatch(favorites.map((dog) => dog.id));
      const matchedDogDetails = favorites.find(
        (dog) => dog.id === matchResult.match
      );
      setMatchedDog(matchedDogDetails || null);
      setFavorites([]);
    } catch (error) {
      setError("Error finding match");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === dog.id)
        ? prevFavorites.filter((fav) => fav.id !== dog.id)
        : [...prevFavorites, dog]
    );
  };

  return (
    <Container>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <Box>
        {!matchedDog && (
          <Typography variant="h4" textAlign="center" gutterBottom>
            Favorite Dogs
          </Typography>
        )}
        {!matchedDog && favorites.length === 0 && (
          <Typography variant="h6" textAlign="center" gutterBottom>
            Add cute dogs to your favorites to find a match!
          </Typography>
        )}

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={2}
          sx={{ mt: 2 }}
        >
          {favorites.map((dog) => (
            <DogsCard
              key={dog.id}
              dog={dog}
              isFavorite={favorites.some((fav) => fav.id === dog.id)}
              onFavoriteToggle={handleFavorite}
            />
          ))}
        </Box>

        {!matchedDog && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFindMatch}
              sx={{
                mt: 5,
                width: "20%",
              }}
              disabled={favorites.length === 0}
            >
              Find Match
            </Button>
          </Box>
        )}
        {loading && <Loader />}
        {matchedDog && (
          <Box mt={5}>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Congratulations! You found a match!
            </Typography>
            <DogsCard dog={matchedDog} />
          </Box>
        )}
      </Box>
    </Container>
  );
};
