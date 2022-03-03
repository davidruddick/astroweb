import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICandidate } from '../candidate.model';
import { isNumeric, isPositiveInt, isValidID } from '../custom-validators';
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
    period: new FormControl("", [Validators.required, isNumeric]),
    duration: new FormControl("", [Validators.required, isNumeric]),
    start: new FormControl("", [Validators.required, isNumeric]),
    sector: new FormControl("")
  })

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
    })
  }

  onClick(){

    let candidate: ICandidate = {
      mission: this.details.value.mission,
      id: this.details.value.id,
      period: this.details.value.period,
      duration: this.details.value.duration,
      t0: this.details.value.start,
    }

    if(this.details.get('mission')?.value == "tess"){
      candidate.sector = this.details.value.sector
    }

    console.log(
      JSON.stringify(candidate)
    )

    this.vet.makeNewPrediction(candidate)

    //this.vet.getPredictionFromAstronet(candidate).subscribe(result=>{
    //  console.log(result)
    //})


  }

}
