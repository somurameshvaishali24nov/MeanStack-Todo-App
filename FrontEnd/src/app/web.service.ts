import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import List from './models/list';
import Task from './models/task';


@Injectable({
    providedIn: 'root'
})  
export class WebService {
    readonly ROOT_URL;
    constructor( private http:HttpClient ) { 
        this.ROOT_URL = "http://localhost:3000";
    }

    get(uri: string) {
        return this.http.get<List[]>(`${this.ROOT_URL}/${uri}`)
    }

    getTask(uri: string) {
        return this.http.get<Task[]>(`${this.ROOT_URL}/${uri}`)
    }

    post(uri: string, payload: Object) {
        return this.http.post<List>(`${this.ROOT_URL}/${uri}`, payload)
    }

    postTask(uri: string, payload: Object) {
        return this.http.post<Task>(`${this.ROOT_URL}/${uri}`, payload)
    }

    patch(uri: string, payload: Object) {
        return this.http.patch(`${this.ROOT_URL}/${uri}`, payload)
    }

    delete(uri: string) {
        return this.http.delete<List>(`${this.ROOT_URL}/${uri}`)
    }

    deleteOnlyTask(uri: string) {
        return this.http.delete<Task>(`${this.ROOT_URL}/${uri}`)
    }
}   
