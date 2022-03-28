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

  vetting = false;
  id: string | null = null;
  star_name: string | null = null;
  image_path: string | null = null;
  prediction: string | null = null;
  error: string | null = null;

  constructor(private vet: VettingService) { }

  ngOnInit(): void {
    this.vet.newPrediction.subscribe(candidate=>{
      this.vetting = true;
      this.id = null;
      this.star_name = null;
      this.image_path = null;
      this.prediction = null;
      this.error = null;

      this.vet.getResult(candidate).subscribe(
        result=>{
          console.log(result)
          this.star_name = result.star_name ? result.star_name : result.star_id
          this.id = result.star_id
          this.prediction = result.prediction
          this.image_path = "../assets/download/" + result.image
          this.vetting = false
        },
        error=>{
          console.log(error)
          this.vetting = false
        }
      )
    })
  }


}


