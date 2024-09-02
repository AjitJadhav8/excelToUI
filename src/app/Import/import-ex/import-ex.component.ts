import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-ex',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './import-ex.component.html',
  styleUrl: './import-ex.component.css'
})
export class ImportExComponent {
  
 files: { name: string, data: any[] }[] = [];
  
 selectedData: any[] = [];


 csvImport(event: any) {
   const fileList = event.target.files; 
   this.files = [];

   for (const file of fileList) {
     const reader = new FileReader(); 
     reader.onload = (e: any) => {
       const wb = XLSX.read(e.target.result);  //read - reads content of file and parse into wb
       const sheets = wb.SheetNames;     //shhetname -    
       if (sheets.length) {
         const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
         this.files.push({ name: file.name, data: rows }); 
         if (this.files.length === 1) {
           this.selectedData = rows;
         }
       }
     };
     reader.readAsArrayBuffer(file); 
   }
 }


 onFileSelect(event: any) {
   const selectedFileName = event.target.value; 
   const selectedFile = this.files.find(file => file.name === selectedFileName);
   if (selectedFile) {
     this.selectedData = selectedFile.data; 
   }
 }


 getHeaders() {
   if (this.selectedData.length > 0) {
     return Object.keys(this.selectedData[0]);
   }
   return []; 
 }
}
