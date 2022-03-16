import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICandidate } from '../candidate.model';
import { isPositiveInt, isPositiveNumber, isValidID, isZeroOrPositiveNumber } from '../custom-validators';
import { VettingService } from '../vetting.service';


@Component({
  selector: 'app-vetting-details',
  templateUrl: './vetting-details.component.html',
  styleUrls: ['./vetting-details.component.css']
})
export class VettingDetailsComponent implements OnInit {

  details = new FormGroup({
    mission: new FormControl("", [Validators.required]),
    prefix: new FormControl(""),
    id: new FormControl("", [Validators.required, isValidID]),
    period: new FormControl("", [Validators.required, isPositiveNumber]),
    duration: new FormControl("", [Validators.required, isPositiveNumber]),
    t0: new FormControl("", [isZeroOrPositiveNumber]),
    sector: new FormControl("")
  })

  error: string | null = null;

  constructor(private vet: VettingService) {
  }

  ngOnInit(): void {
    this.details.get('mission')?.valueChanges.subscribe(mission=>{
      switch(mission){
        case "kepler":
          this.details.get('prefix')?.setValue("KIC ")
          this.details.get('sector')?.clearValidators()
          break;
        case "tess":
          this.details.get('prefix')?.setValue("TIC ")
          this.details.get('sector')?.setValidators([Validators.required, isPositiveInt])
          break;
      }
      this.details.get('sector')?.updateValueAndValidity()
    })
  }

  onClick(){

    this.error = null;

    let candidate: ICandidate = {
      mission: this.details.value.mission,
      id: this.details.value.id,
      period: this.details.value.period,
      duration: this.details.value.duration,
      t0: this.details.value.t0 ? this.details.value.t0 : "0",
    }

    if(this.details.get('mission')?.value == "tess"){
      candidate.sector = this.details.value.sector
    }

    console.log(
      JSON.stringify(candidate)
    )

    this.vet.makeNewPrediction(candidate)
    this.vet.newError.subscribe(error=>{
      this.error = error
    })

  }

}
