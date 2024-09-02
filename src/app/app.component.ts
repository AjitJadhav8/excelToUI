import { Component } from '@angular/core';
import { ImportExComponent } from './Import/import-ex/import-ex.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImportExComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent {
  title = 'excelToUi';
 
}
