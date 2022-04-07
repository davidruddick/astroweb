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
  result: Result | null = null;
  error: string | null = null;
  planetKeys = ["planet_name", "period", "discovery_date", "discovery_method"]

  constructor(private vet: VettingService) { }

  ngOnInit(): void {
    this.vet.newPrediction.subscribe(candidate=>{
      this.getting_results = true;
      this.result = null
      this.error = null;

      this.vet.getResult(candidate).subscribe(
        result=>{
          console.log(result)
          this.result = result
          this.getting_results = false
        },
        error=>{
          console.log(error)
          this.getting_results = false
        }
      )
    })
  }


}


