import type { Movie } from '../types/movie'

export const FALLBACK_MOVIES: Movie[] = [
  { id: 'titanic', title: 'Titanic', year: 1997, budget: 200000000, revenue: 2264000000, tag: 'Romance / Catastrophe', from: '#163a56', to: '#050d14', posterUrl: null },
  { id: 'avatar', title: 'Avatar', year: 2009, budget: 237000000, revenue: 2740000000, tag: 'Science-fiction', from: '#0f5132', to: '#04140d', posterUrl: null },
  { id: 'endgame', title: 'Avengers: Endgame', year: 2019, budget: 356000000, revenue: 2799000000, tag: 'Super-héros', from: '#4a1942', to: '#0d0610', posterUrl: null },
  { id: 'force-awakens', title: 'Star Wars: Le Réveil de la Force', year: 2015, budget: 245000000, revenue: 2068000000, tag: 'Space opera', from: '#0d1b2e', to: '#020308', posterUrl: null },
  { id: 'jurassic-world', title: 'Jurassic World', year: 2015, budget: 150000000, revenue: 1670000000, tag: 'Aventure / Monstres', from: '#2f4a1e', to: '#0a1206', posterUrl: null },
  { id: 'lion-king', title: 'Le Roi Lion', year: 2019, budget: 260000000, revenue: 1657000000, tag: 'Animation', from: '#a85d1f', to: '#2e1604', posterUrl: null },
  { id: 'black-panther', title: 'Black Panther', year: 2018, budget: 200000000, revenue: 1347000000, tag: 'Super-héros', from: '#3b1f5c', to: '#140a06', posterUrl: null },
  { id: 'dark-knight', title: 'The Dark Knight', year: 2008, budget: 185000000, revenue: 1005000000, tag: 'Super-héros / Polar', from: '#10141c', to: '#000000', posterUrl: null },
  { id: 'inception', title: 'Inception', year: 2010, budget: 160000000, revenue: 826000000, tag: 'Thriller mental', from: '#243447', to: '#080c11', posterUrl: null },
  { id: 'joker', title: 'Joker', year: 2019, budget: 70000000, revenue: 1074000000, tag: 'Drame', from: '#173d1f', to: '#2a0e3a', posterUrl: null },
  { id: 'get-out', title: 'Get Out', year: 2017, budget: 4500000, revenue: 255000000, tag: 'Horreur sociale', from: '#5c0a14', to: '#0a0204', posterUrl: null },
  { id: 'blair-witch', title: 'Le Projet Blair Witch', year: 1999, budget: 60000, revenue: 248000000, tag: 'Horreur found-footage', from: '#2c3b1f', to: '#070a04', posterUrl: null },
  { id: 'john-carter', title: 'John Carter', year: 2012, budget: 250000000, revenue: 284000000, tag: 'Science-fiction (flop)', from: '#8a2f12', to: '#220a02', posterUrl: null },
  { id: 'waterworld', title: 'Waterworld', year: 1995, budget: 175000000, revenue: 264000000, tag: 'Post-apo aquatique', from: '#0d4a5c', to: '#021014', posterUrl: null },
]
