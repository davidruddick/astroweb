import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { Result } from '../result.model';
import { VettingService } from '../vetting.service';

@Component({
  selector: 'app-vetting-results',
  templateUrl: './vetting-results.component.html',
  styleUrls: ['./vetting-results.component.css']
})
export class VettingResultsComponent implements OnInit {

  getting_results = false;
  status = "No results to display"
  result: Result | null = null;
  error: string | null = null;
  planetKeys = ["planet_name", "period", "discovery_date", "discovery_method"]

  constructor(private vet: VettingService) { }

  getConfidence(): string{
    if(this.result?.prediction){
      if(parseFloat(this.result.prediction.slice(0, -1)) > 90){ // confident yes
        return "good_prediction"
      }
      if(parseFloat(this.result.prediction.slice(0, -1)) > 50){ // guessing
        return "medium_prediction"
      }
    }
    return "bad_prediction" // confident no
  }

  ngOnInit(): void {

    this.vet.newPrediction.subscribe(candidate=>{

      // clear old results
      this.getting_results = true;
      this.result = null
      this.error = null;

      // subscribe to any new status updates
      this.vet.newStatus.subscribe(status=>{
        this.status = status
      })

      // pass new candidate into getResult method, subscribe to the result
      this.vet.getResult(candidate).subscribe(
        result=>{
          console.log(result)
          this.result = result
        },
        error=>{
          console.log(error)
        }).add(()=>{
          this.getting_results = false
          this.status = "No results to display"
      })
    })
  }


}


