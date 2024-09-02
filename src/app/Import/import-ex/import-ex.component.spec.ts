import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExComponent } from './import-ex.component';

describe('ImportExComponent', () => {
  let component: ImportExComponent;
  let fixture: ComponentFixture<ImportExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportExComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
