import { Injectable } from '@angular/core';
import { Section } from './section';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private sectionsUrl = "api/sections";
  private APIUrl = "https://salty-cove-22105.herokuapp.com/api/coursetest?query=";
  private searchURL = "https://salty-cove-22105.herokuapp.com/api/smart";

  getSections(query: string): Observable<Section[]> {
    const url = `${this.APIUrl}${query}`;
    console.log(query);
    console.log(url);

    return this.http.get<Section[]>(url).pipe(tap(_ => this.log(`fetched sections for ${query}`)), catchError(this.handleError<Section[]>('getSections', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getSection(sid: string): Observable<Section> {
    // this.log(`SectionService: fetched section id=${id}`);
    const url = `${this.APIUrl}${sid}&single=true`;
    return this.http.get<Section>(url).pipe(tap(_ => this.log('fetched sections')), catchError(this.handleError<Section>('getSections')));
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  updateSection(section: Section): Observable<any> {
    return this.http.put(this.sectionsUrl, section, this.httpOptions).pipe(tap(_ => this.log(`updated section id=${section.id}`)), catchError(this.handleError<any>('updateSection')));
  }

  addSection(section: Section): Observable<Section> {
    return this.http.post<Section>(this.sectionsUrl, section, this.httpOptions).pipe(tap((newSection: Section) => this.log(`added section with id=${newSection.id}`)), catchError(this.handleError<Section>('addSection')));
  }

  deleteSection(section: Section | number): Observable<Section> {
    const id = typeof section === 'number' ? section : section.id;
    const url = `${this.sectionsUrl}/${id}`;
    return this.http.delete<Section>(url, this.httpOptions).pipe(tap(_ => this.log(`deleted section id=${id}`)), catchError(this.handleError<Section>('deleteSection')));
  }

  searchSections(term: string): Observable<Section[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Section[]>(`${this.searchURL}?query=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found sections matching "${term}"`) :
        this.log(`no sections matching "${term}"`)),
      catchError(this.handleError<Section[]>('searchSections', []))
    );
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`SectionService: ${message}`);
  }
}