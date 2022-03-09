import { Component, OnInit } from '@angular/core';
import { VettingService } from '../vetting.service';

@Component({
  selector: 'app-vetting-results',
  templateUrl: './vetting-results.component.html',
  styleUrls: ['./vetting-results.component.css']
})
export class VettingResultsComponent implements OnInit {

  vetting = false;
  id: string | null | undefined;
  image_path: string | null | undefined;
  prediction: string | null | undefined;

  constructor(private vet: VettingService) { }

  ngOnInit(): void {
    this.vet.newPrediction.subscribe(candidate=>{
      this.vetting = true;
      this.vet.getPredictionFromAstronet(candidate).subscribe(result=>{
        this.id = result.id
        this.prediction = result.prediction
        this.image_path = "../assets/download/" + result.image
        this.vetting = false
      },
      error=>{
        console.log(error)
        this.vetting = false
      })
    })
  }


}


