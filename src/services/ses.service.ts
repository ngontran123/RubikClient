import { Injectable,NgZone } from '@angular/core';
import { Observable,Subject} from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SesService {
 
  constructor(private ngZone:NgZone) { }
  eventSource!:EventSource;
  eventSubject: Subject<any> = new Subject();

   initEventSource(username:string):Observable<any>
  {
    if(this.eventSource)
      {
        this.eventSource.close();
      }
     return new Observable(observer=>
      {
      var url=`${environment.server_url}/mqtt_connect/${username}`;
      this.eventSource=new EventSource(url);
      this.eventSource.onmessage=(event)=>
      { 
        observer.next(event);
      }
      this.eventSource.onerror=(error)=>
      {
        observer.error(error);
      }
    });
  }





  getEvent():Observable<any>
  {
     return this.eventSubject.asObservable();
  }
}
