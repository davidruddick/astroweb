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
