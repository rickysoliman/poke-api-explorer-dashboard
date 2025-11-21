export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number; // decimetres
  weight: number; // hectograms
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
      showdown: {
        front_default: string | null;
      };
    };
  };
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
  species: {
    url: string; // Crucial for species data lookup
  };
}

export interface SpeciesData {
  pokedexEntry: string;
  genus: string;
  color: string;
}
