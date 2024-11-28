import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private apiUrl = 'http://localhost:3000'; // URL del backend

  async getCategories() {
    const response = await axios.get(`${this.apiUrl}/categories`);
    return response.data;
  }

  async getProducts(categoryId: number) {
    const response = await axios.get(`${this.apiUrl}/products/${categoryId}`);
    return response.data;
  }
}
