import { HttpClient } from '@angular/common/http';
import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { ICandidate } from './candidate.model';
import { IResult } from './result.model'

@Injectable({
  providedIn: 'root'
})
export class VettingService{

  result: IResult = {
    id: null,
    prediction: null,
    image: null
  }

  newPrediction = new Subject<ICandidate>()
  newError = new Subject<string>()


  constructor(private http: HttpClient) { }

  makeNewPrediction(candidate: ICandidate){
    this.newPrediction.next(candidate)
  }

  getError(error: string){
    this.newError.next(error)
  }

  get_unique(values: string[]){
    let star_name: string = values[0][0]
    let star_aliases: string[] = []
    let known_exoplanets: string[] = []
    for(let i = 0; i<values.length; i++){
      if(!star_aliases.includes(values[i][2])){
        star_aliases.push(values[i][2])
      }
      if(!known_exoplanets.includes(values[i][1])){
        known_exoplanets.push(values[i][1])
      }
    }
    console.log(star_name, star_aliases, known_exoplanets)
  }

  getPredictionFromAstronet(candidate: ICandidate){

    let prefix = ""
    switch(candidate.mission){
      case "kepler":
        prefix = "kic"
        break;
      case "tess":
        prefix = "tic"
        break;
    }
    let full_id = prefix + candidate.id


    this.http.get<any>('http://simbad.u-strasbg.fr/simbad/sim-tap/sync',
    {
      params: {
        request: "doQuery",
        lang: "adql",
        format: "json",
        query: `SELECT star.main_id AS star_name, planet.main_id AS planet_name, i1.id AS alias
        FROM basic AS planet
        JOIN h_link ON child = planet.oid
        JOIN ident AS i1 ON i1.oidref = parent
        JOIN ident AS i2 ON i2.oidref = i1.oidref
        JOIN basic AS star ON star.oid = i2.oidref WHERE i2.id = 'KIC011442793'`,
      }
    }).pipe(
      map(response=>{
        return response["data"]
      })
    ).subscribe(result=>{
      this.get_unique(result)
    })


    return this.http.get<IResult>('http://127.0.0.1:4201/',
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
      map(response=>{
        console.log(response)
        this.result = response
        this.result.id = candidate.id
        return this.result
      }),
      catchError(error=>{
        this.getError(error.error)
        return throwError(() => new Error(error.error))
      })
    )
  }



}
