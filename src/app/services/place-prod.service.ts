import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {API_URL} from "../../main";
import {ApiResponse} from "../model/apiResponse";
import {placeProduct} from "../model/placeProduct";

const endpoint = `${API_URL}/placeProducts`;

interface response extends ApiResponse {
  message: string,
  data: placeProduct[]
}

@Injectable({
  providedIn: 'root'
})
export class PlaceProdService {
  constructor(private http: HttpClient) { }


  getAll() {
    return this.http.get<placeProduct[]>(`${API_URL}/placeProducts`)
  }
}