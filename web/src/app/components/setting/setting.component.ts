import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface Config {
  name: string;
  xpath: string;
  method: string;
  type: string;
  config: Config[] | null;
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class SettingComponent implements OnInit {

  configForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.configForm = this.fb.group({
      configs: this.fb.array([ this.createConfig() ])
    });
  }

  createConfig(): FormGroup {
    return this.fb.group({
      name: [''],
      xpath: [''],
      method: [''],
      type: [''],
      config: this.fb.array([])
    });
  }

  addConfig(): void {
    this.configs.push(this.createConfig());
  }

  removeConfig(index: number): void {
    this.configs.removeAt(index);
  }

  get configs(): FormArray {
    return this.configForm.get('configs') as FormArray;
  }

  onSubmit(): void {
    console.log(this.configForm.value);
  }
}