import { Component, OnInit } from '@angular/core';
import { range } from 'rxjs';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  input_cols = ["Key", "Description"]
  input_items = [
    {item: "Mission", description: "Which mission did you find the transit in? This determines the Astronet variant to be run"},
    {item: "ID", description: "The KIC or TIC number of the star"},
    {item: "Period", description: "The orbital period in days"},
    {item: "Duration", description: "How long does the transit event last in days?"},
    {item: "Epoch Phase", description: "Optional. When does the first transit occur in the data?"},
    {item: "Sector", description: "TESS only. This is required for downloading the correct dataset"}
  ]

  example_cols = ["Key", "Description"]
  example_items = [
    {index: "1", description: "Star main identifier, if known"},
    {index: "2", description: "Probability that this is an exoplanet, according to Astronet. The liklihood that this is a false negative is ~2%. \
    However, for TESS candidates, the liklihood that this is a false positive is ~30%"},
    {index: "3", description: "Images of the light curve itself. If the local view shows an off-center curve, you may need to adjust your parameters"},
    {index: "4", description: "Known information about the star, as provided by NASA and Simbad (see About/Acknowledgements)"}
  ]

  error_cols = ["errorKey", "Description"]
  error_items = [
    {error: "Error retrieving star information", description: "The star was not found in the NASA or Simbad databases"},
    {error: "Error downloading fits data for given ID", description: "The fits data could not be downloaded. The ID or sector may be wrong"},
    {error: "Error while processing data with Astronet model", description: "The data could not be processed by Astronet. The model may require restarting"}
  ]


  constructor() { }



  ngOnInit(): void {


  }

}
