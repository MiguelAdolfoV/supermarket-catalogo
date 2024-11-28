import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];

  constructor(private catalogService: CatalogService) {}

  async ngOnInit() {
    this.categories = await this.catalogService.getCategories();
  }
}
