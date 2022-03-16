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
        query: "SELECT main_id AS \"Main identifier\" FROM basic JOIN ident ON oidref = oid WHERE id = '" + full_id + "'",
      }
    }).pipe(
      map(response=>{
        return response["data"][0][0]
      })
    ).subscribe(result=>{
      console.log(result)
    })

    this.http.get<any>('http://simbad.u-strasbg.fr/simbad/sim-tap/sync',
    {
      params: {
        request: "doQuery",
        lang: "adql",
        format: "json",
        query: "SELECT id2.id FROM ident AS id1 JOIN ident AS id2 USING(oidref) WHERE id1.id = '" + full_id + "'",
      }
    }).pipe(
      map(response=>{
        return response["data"]
      })
    ).subscribe(result=>{
      console.log(result)
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
