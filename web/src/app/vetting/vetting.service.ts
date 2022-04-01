import { HttpClient } from '@angular/common/http';
import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, forkJoin, map, Observable, Subject, throwError } from 'rxjs';
import { Candidate } from './candidate.model';
import { Planet } from './planet.model';
import { Result } from './result.model'

interface Star{
  name: string,
  type: string,
  metallicity: number,
  surface_gravity: number,
  temperature: number,
  aliases: string[],
  known_exoplanets: Planet[]
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

  getError(error: string){
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

  get_planets(arrays: any[]): Planet[]{
    let planets: Planet[] = []
    for(var i=0; i<arrays.length; i++){
      let planet_name = arrays[i][6]
      if(!this.doesPlanetAlreadyExist(planets, planet_name)){
        let planet: Planet = {
          planet_name: planet_name,
          planet_dec: arrays[i][7],
          planet_ra: arrays[i][8]
        }
        planets.push(planet)
      }
    }
    return planets
  }

  doesPlanetAlreadyExist(planets: Planet[], planet_name: string): boolean {
    for(let i=0; i<planets.length; i++){
      if(planets[i].planet_name == planet_name){
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
            star_name: response[0].name,
            star_type: response[0].type,
            star_metallicity: response[0].metallicity,
            star_surface_gravity: response[0].surface_gravity,
            star_temperature: response[0].temperature,
            star_aliases: response[0].aliases,
            known_exoplanets: response[0].known_exoplanets,
            prediction: response[1].prediction,
            image: response[1].image
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
        this.getError(error.error)
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
        max_records: "10000",
        query: `SELECT
                  star_basic.main_id,
                  star_basic.sp_type,
                  star_extended.fe_h,
                  star_extended.log_g,
                  star_extended.teff,
                  star_alias.id,
                  planet.main_id,
                  planet.ra,
                  planet.dec
                FROM basic AS planet
                  JOIN h_link AS link ON link.child = planet.oid
                  JOIN ident AS star_alias ON star_alias.oidref = link.parent
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
            metallicity: this.get_mean_value(result.map((column: string) => column[2])),
            surface_gravity: this.get_mean_value(result.map((column: string) => column[3])),
            temperature: this.get_mean_value(result.map((column: string) => column[4])),
            aliases: this.get_unique_values(result.map((column: string) => column[5])),
            known_exoplanets: this.get_planets(result)
          }
      }),
      catchError(error=>{
        console.log(error)
        let message = "No star found matching given ID"
        this.getError(message)
        return throwError(() => new Error(message))
      })
    )
  }
}
