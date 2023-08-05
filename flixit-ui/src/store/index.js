import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

export const getGenres = createAsyncThunk("flixxit/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=5b8d780fbc97dd274a59f7a907791512"
  );
  console.log(genres)
  return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
      });
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
  "flixxit/genre",
  async ({ genre, type }, thunkAPI) => {
    const {
      flixxit: { genres },
    } = thunkAPI.getState();
    if (genre.length <= 2) {

      return getRawData(
        `https://api.themoviedb.org/3/discover/${type}?api_key=5b8d780fbc97dd274a59f7a907791512&with_genres=${genre}`,
        genres
      );
    }
    else {
      return getRawData(
        `https://api.themoviedb.org/3/search/movie?query=${genre}&api_key=5b8d780fbc97dd274a59f7a907791512`,
        genres
      );
    }
  }
);

export const fetchMovies = createAsyncThunk(
  "flixxit/trending",
  async ({ type }, thunkAPI) => {
    const {
      flixxit: { genres },
    } = thunkAPI.getState();
    console.log("typeeeee", type)
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const fetchSearchMovies = createAsyncThunk(
  "flixxit/searching",
  async ({ genre }, thunkAPI) => {
    const {
      flixxit: { genres },
    } = thunkAPI.getState();
    console.log(genre)
    return getRawData(
      `https://api.themoviedb.org/3/search/movie?query=${genre}&api_key=5b8d780fbc97dd274a59f7a907791512`,
      genres
    )
  }
)

export const getUsersLikedMovies = createAsyncThunk(
  "flixxit/getLiked",
  async (email) => {
    const {
      data: { movies },
    } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
    return movies;
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  "flixxit/deleteLiked",
  async ({ movieId, email }) => {
    const { data: { movies, msg }, } = await axios.put("http://localhost:5000/api/user/remove", {
      email,
      movieId,
    });
    toast(msg)
    return movies;
  }
);

const FlixxitSlice = createSlice({
  name: "Flixxit",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    flixxit: FlixxitSlice.reducer,
  },
});

export const { setGenres, setMovies } = FlixxitSlice.actions;
