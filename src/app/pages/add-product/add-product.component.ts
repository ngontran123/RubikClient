import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HandleService } from '../../../services/handle.service';
import { PopupService } from '../../../services/popup.service';
import { HeaderComponent } from '../../shared/layouts/header/header.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule,HeaderComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  providers:[HandleService,PopupService]
})
export class AddProductComponent implements OnInit {
  productForm!:FormGroup;
  constructor(private fb:FormBuilder,private handleService:HandleService)
  {
  }

  async loadAddProductPage()
  {
    await this.handleService.getAddProduct();
  }

  ngOnInit(): void {
    this.loadAddProductPage();
    this.productForm=this.fb.group(
    {
     productname:new FormControl('',[Validators.required]),
     description:new FormControl('',[Validators.required]),
     url:new FormControl('',[Validators.required]),
     feature:new FormControl('')
    });
  }

  async onSubmitForm()
  {
    if(!this.productForm.valid)
    {
      this.productForm.markAllAsTouched();
    }
    else
    {
    await this.handleService.postProduct(this.productForm.value);
    this.productForm.reset();
    }
  }
}
