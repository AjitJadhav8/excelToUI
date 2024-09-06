
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-ex',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './import-ex.component.html',
  styleUrls: ['./import-ex.component.css']
})
export class ImportExComponent {
  files: { name: string, sheets: string[], data: { [sheetName: string]: { [key: string]: any }[] } }[] = []; // Specify the type of 'data' correctly
  selectedData: any[] = []; // Array
  selectedFile: { name: string, sheets: string[], data: { [sheetName: string]: { [key: string]: any }[] } } | null = null; // Proper typing for 'data'
  selectedSheet: string | null = null; // Sheet name
  searchTerm: string = ''; // String
  sortColumn: string | null = null; // String or it can be null
  sortDirection: 'asc' | 'desc' = 'asc'; // Default is ascending

  csvImport(event: any): void {
    const fileList = event.target.files; // List of files that the user selects
    this.files = []; // Clear previous

    for (const file of fileList) { // Each uploaded file
      const reader = new FileReader();  // FileReader is a built-in API that allows you to read the contents of the file and process it.
      reader.onload = (e: any) => { // After successfully reading the file, onload is triggered
        const wb = XLSX.read(e.target.result); // SheetJS reads binary data from the file and parses it into a workbook object (wb)
        const sheets = wb.SheetNames; // Extract the names of the sheets in the workbook.
        const data: { [sheetName: string]: { [key: string]: any }[] } = {}; // Properly typed data

        sheets.forEach(sheet => {
          data[sheet] = XLSX.utils.sheet_to_json(wb.Sheets[sheet]); // Converts data from each sheet to JSON
        });

        if (sheets.length) { // Any sheets? If yes, then go
          this.files.push({ name: file.name, sheets, data }); // Add the newly processed file to the files array with its sheet data
          if (this.files.length === 1) {
            this.selectedFile = this.files[0]; // Automatically select the first file
            this.selectedSheet = sheets[0]; // Automatically select the first sheet
            this.selectedData = data[sheets[0]]; // Display the first sheet's data
          }
        }
      };
      reader.readAsArrayBuffer(file); // This method reads the file as an ArrayBuffer (binary data)
    }
  }

  // This function updates the displayed data when a user selects a file from the dropdown.
  onFileSelect(event: any): void {
    const selectedFileName = event.target.value;
    this.selectedFile = this.files.find(file => file.name === selectedFileName) || null;
    if (this.selectedFile && this.selectedFile.sheets.length > 0) {
      this.selectedSheet = this.selectedFile.sheets[0]; // Automatically select the first sheet
      this.selectedData = this.selectedFile.data[this.selectedSheet]; // Display the first sheet's data
    }
  }

  // This function updates the displayed data when a user selects a sheet from the dropdown.
  onSheetSelect(event: any): void {
    this.selectedSheet = event.target.value;
    if (this.selectedFile && this.selectedSheet) {
      this.selectedData = this.selectedFile.data[this.selectedSheet]; // Update selected data based on sheet
    }
  }

  getHeaders(): string[] {
    if (this.selectedData.length > 0) {  // It checks if there is any data to display
      return Object.keys(this.selectedData[0]);
    }
    return [];
  }

  // Filter and sort data based on search term and sort preferences
  // This getter applies filtering and sorting to the selectedData based on the search term, selected column, and sort direction.
  get filteredData(): any[] {
    const searchTermLower = this.searchTerm.toLowerCase();
    return this.selectedData
      .filter(row =>
        Object.values(row).some(value => { // Contains the search term?
          const valueStr = value ? value.toString() : '';
          return valueStr.toLowerCase().includes(searchTermLower);
        })
      )
      .sort((a, b) => {
        if (this.sortColumn) {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1; // (which means a should come BEFORE b)
          if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1; // (which means a should come AFTER b)
        }
        return 0;
      });
  }

  // Update the sort column based on user selection
  onSortColumnChange(event: any): void {
    this.sortColumn = event.target.value;
  }

  // Update the sort direction based on user selection
  onSortDirectionChange(event: any): void {
    this.sortDirection = event.target.value as 'asc' | 'desc';
  }
}
