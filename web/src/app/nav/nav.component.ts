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

    let popup = document.getElementById("popup");
    let img = document.getElementById("popup_image_large");
    let src = document.getElementById("popup_image_small")?.getAttribute("src")
    let caption = document.getElementById("popup_caption");

    if(popup && img && src && caption){ // if elements exist

      if(display){
        img.setAttribute("src", src)
        caption.innerHTML = "Artist’s impression of the TRAPPIST-1 planetary system <br/> Credit: ESO/N. Bartmann/spaceengine.org"
        popup.style.display = "block";

      } else{
        popup.style.display = "none";
      }


    }

  }


}
