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
  files: { name: string, data: any[] }[] = [];
  selectedData: any[] = [];
  searchTerm: string = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  csvImport(event: any): void {
    const fileList = event.target.files; 
    this.files = [];

    for (const file of fileList) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const wb = XLSX.read(e.target.result);
        const sheets = wb.SheetNames;
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

  onFileSelect(event: any): void {
    const selectedFileName = event.target.value;
    const selectedFile = this.files.find(file => file.name === selectedFileName);
    if (selectedFile) {
      this.selectedData = selectedFile.data;
    }
  }

  getHeaders(): string[] {
    if (this.selectedData.length > 0) {
      return Object.keys(this.selectedData[0]);
    }
    return [];
  }

  // Filter and sort data based on search term and sort preferences
  get filteredData(): any[] {
    const searchTermLower = this.searchTerm.toLowerCase();
    return this.selectedData
      .filter(row =>
        Object.values(row).some(value => {
          const valueStr = value ? value.toString() : '';
          return valueStr.toLowerCase().includes(searchTermLower);
        })
      )
      .sort((a, b) => {
        if (this.sortColumn) {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
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
