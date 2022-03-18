import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  display_image(display: boolean){

    let exoplanet_img = document.getElementById("exoplanet_big");
    let src = document.getElementById("exoplanet_small")?.getAttribute("src")

    if(exoplanet_img != undefined && src != undefined){

      if(display){
        exoplanet_img.setAttribute("src", src)
        exoplanet_img.style.display = "block";

      } else{
        exoplanet_img.style.display = "none";
      }


    }

  }


}
