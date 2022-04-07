import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, concatMap, forkJoin, map, mergeMap, Observable, Subject, throwError } from 'rxjs';
import { Candidate } from './candidate.model';
import { Planet } from './planet.model';
import { Result } from './result.model'

interface Star{
  name: string,
  type: string,
  declination: string,
  right_ascension: string,
  metallicity: number,
  surface_gravity: number,
  temperature: number,
  aliases: string[],
  known_exoplanets?: Planet[]
}

interface Prediction{
  prediction: string,
  image: string
}

@Injectable({
  providedIn: 'root'
})
export class VettingService{


  newPrediction = new Subject<Candidate>()
  newError = new Subject<string>()


  constructor(private http: HttpClient) { }

  makeNewPrediction(candidate: Candidate){
    this.newPrediction.next(candidate)
  }

  publishError(error: string){ // broadcast the error to interested parties
    this.newError.next(error)
  }

  get_unique_values(values: string[]): string[] {
    let unique_values: string[] = []
    for(let i = 0; i<values.length; i++){
      if(!unique_values.includes(values[i])){
        unique_values.push(values[i])
      }
    }
    return unique_values
  }

  get_mean_value(values: string[]): number{
    return values.map(Number).reduce((a, b) => a + b, 0)/values.length
  }

  get_gaia_id(aliases: string[]): string | null{
    for(let alias of aliases){
      if(alias.substring(0, 4) == "Gaia"){
        return "Gaia DR2 " + alias.split(' ')[2]
      }
    }
    return null
  }

  get_unique_planets(arrays: any[], star_name: string){
    let planets: Planet[] = []
    for(var i=0; i<arrays.length; i++){
      let planet_letter = arrays[i]["pl_letter"]
      if(!this.doesPlanetAlreadyExist(planets, planet_letter)){
        let planet: Planet = {
          planet_name: star_name + planet_letter,
          period: arrays[i]["pl_orbper"],
          discovery_date: arrays[i]["disc_year"],
          discovery_method: arrays[i]["discoverymethod"]
        }
        planets.push(planet)
      }
    }
    return planets
  }

  doesPlanetAlreadyExist(planets: Planet[], planet_letter: string): boolean {
    for(let i=0; i<planets.length; i++){
      if(planets[i].planet_name.slice(-1) == planet_letter){
        return true
      }
    }
    return false
  }

  getResult(candidate: Candidate): Observable<Result>{
    return forkJoin(this.getStarDetails(candidate), this.getPredictionFromAstronet(candidate)
    ).pipe(
      map((response: any)=>{
          return <Result>{
            star_id: candidate.id,
            star_name: response[0].name ? response[0].name : candidate.id,
            star_type: response[0].type !="null" ? response[0].type : "Unknown",
            star_metallicity: response[0].metallicity,
            star_surface_gravity: response[0].surface_gravity / 100,
            star_temperature: response[0].temperature + 273.15,
            star_aliases: response[0].aliases,
            known_exoplanets: response[0].known_exoplanets,
            prediction: response[1].prediction,
            image: "../assets/download/" + response[1].image
          }
      }),
      catchError(error=>{
        return throwError(error)
      })
    )
  }

  getPredictionFromAstronet(candidate: Candidate): Observable<Prediction>{
    return this.http.get<Prediction>('http://127.0.0.1:4201/',
    {
      params: {
        mission: candidate.mission,
        id: candidate.id,
        period: candidate.period,
        duration: candidate.duration,
        t0: candidate.t0,
        sector: candidate.sector
      }
    }
    ).pipe(
      map((response: any)=>{
        return <Prediction>{
          prediction: response.prediction,
          image: response.image
        }
      }),
      catchError(error=>{
        this.publishError(error.error)
        return throwError(() => new Error(error.error))
      })
    )
  }

  getStarDetails(candidate: Candidate): Observable<Star>{
    let id = candidate.id
    switch(candidate.mission){
      case "kepler":
        id = "kic" + id
        break;
      case "tess":
        id + "tic" + id
        break;
    }
    return this.http.get<Star>('http://simbad.u-strasbg.fr/simbad/sim-tap/sync',
    {
      params: {
        request: "doQuery",
        lang: "adql",
        format: "json",
        max_records: "1000",
        query: `SELECT
                  star_basic.main_id,
                  star_basic.sp_type,
                  star_basic.dec,
                  star_basic.ra,
                  star_extended.fe_h,
                  star_extended.log_g,
                  star_extended.teff,
                  star_alias.id
                FROM ident AS star_alias
                  JOIN mesFe_h AS star_extended ON star_extended.oidref = star_alias.oidref
                  JOIN basic AS star_basic ON star_basic.oid = star_extended.oidref
                  JOIN ident AS star ON star.oidref = star_basic.oid
                WHERE star.id = '` + id + `'`
      }
    }).pipe(
      map((response: any)=>{
        const result = response["data"]
          return <Star>{
            name: String(result[0][0]),
            type: String(result[0][1]),
            declination: String(result[0][2]),
            right_ascension: String(result[0][3]),
            metallicity: this.get_mean_value(result.map((column: string) => column[4])),
            surface_gravity: this.get_mean_value(result.map((column: string) => column[5])),
            temperature: this.get_mean_value(result.map((column: string) => column[6])),
            aliases: this.get_unique_values(result.map((column: string) => column[7]))
          }
      }),
      concatMap((star: Star)=>{
        let gaia_id = this.get_gaia_id(star.aliases)
        console.log(gaia_id)
        return this.http.get<Star>('https://exoplanetarchive.ipac.caltech.edu/TAP/sync',
        {
          params: {
                  request: "doQuery",
                  lang: "adql",
                  format: "json",
                  max_records: "1000",
                  query: `SELECT pl_letter, disc_year, discoverymethod, pl_orbper FROM ps WHERE gaia_id = '` + gaia_id +  `'`
          }
        }).pipe(
          map((response: any)=>{
            star.known_exoplanets = this.get_unique_planets(response, star.name)
            return star
          })
        )
      }),
      catchError(error=>{
        console.log(error)
        let message = ""
        if(error.status == "400"){
          message = "Error retrieving star information. Please confirm ID is correct."
        } else {
          message = environment.default_error
        }
        this.publishError(message)
        return throwError(() => new Error(message))
      })
    )
  }
}
