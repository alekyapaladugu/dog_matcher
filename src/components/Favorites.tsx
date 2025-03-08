import { useState } from "react";
import { Dog, getMatch } from "../api/dogService";
import { Box, Button, Container, Typography } from "@mui/material";
import { DogsCard } from "./DogsCard";
import ErrorModal from "../components/ErrorModal";
import Loader from "./Loader";
import { useMutation } from "@tanstack/react-query";

interface FavoriteDogsProps {
  favorites: Dog[];
  setFavorites: React.Dispatch<React.SetStateAction<Dog[]>>;
}

export const Favorites = ({ favorites, setFavorites }: FavoriteDogsProps) => {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dogMatchMutation = useMutation({
    mutationFn: getMatch,
    onSuccess: (data) => {
      const matchedDogDetails = favorites.find((dog) => dog.id === data.match);
      setMatchedDog(matchedDogDetails || null);
      setFavorites([]);
    },
    onError: (error) => {
      setError(`Error finding match: ${error}`);
    },
  });

  const handleFindMatch = () => {
    dogMatchMutation.mutate(favorites.map((dog) => dog.id));
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
            Favorite Dogs
          </Typography>
        )}
        {!matchedDog && favorites?.length === 0 && (
          <Typography variant="h6" textAlign="center" gutterBottom>
            Add cute dogs to your favorites to find a match!
          </Typography>
        )}
        {favorites.length === 1 ? (
          <Box sx={{ maxWidth: 400, margin: "auto" }}>
            {favorites.map((dog) => (
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
            {favorites.map((dog) => (
              <DogsCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.some((fav) => fav.id === dog.id)}
                onFavoriteToggle={handleFavorite}
              />
            ))}
          </Box>
        )}

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
        {dogMatchMutation.isPending && <Loader />}
        {matchedDog && (
          <Box mt={5}>
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
              Congratulations! You found a match!
            </Typography>
            <Box sx={{ maxWidth: 400, margin: "auto" }}>
              <DogsCard dog={matchedDog} />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};
