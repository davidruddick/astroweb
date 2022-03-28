import { Planet } from "./planet.model";

export interface Result{

  star_id: string,
  star_name: string,
  star_type: string,
  star_metallicity: number,
  star_surface_gravity: number,
  star_temperature: number,
  star_aliases: string[],
  known_exoplanets: Planet[],
  prediction: string | null,
  image: string | null

}
