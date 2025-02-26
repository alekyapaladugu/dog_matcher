import {
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Typography,
} from "@mui/material";
import { Dog } from "../api/dogService";

interface DogCardProps {
  dog: Dog;
  isFavorite?: boolean;
  onFavoriteToggle?: (dog: Dog) => void;
}

export const DogsCard = ({
  dog,
  isFavorite,
  onFavoriteToggle,
}: DogCardProps) => {
  return (
    <Card sx={{ p: 2, borderRadius: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={dog.img}
        alt={dog.name}
        sx={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography variant="h6">{dog.name}</Typography>
        <Typography>Breed: {dog.breed}</Typography>
        <Typography>Age: {dog.age}</Typography>
        <Typography>Zip Code: {dog.zip_code}</Typography>
        {onFavoriteToggle && (
          <>
            <Checkbox
              checked={isFavorite || false}
              onChange={() => onFavoriteToggle(dog)}
              sx={{
                "&.Mui-checked": { color: "primary.main" },
                pl: 0,
              }}
            />
            Favorite
          </>
        )}
      </CardContent>
    </Card>
  );
};
