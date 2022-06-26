import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NewsSearchService } from './service/news-search.service';
import { throttleTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NewsSearch';
  @ViewChild('search') search: ElementRef;
  str: string;
  isLoading: boolean;
  throttleFlag = true;
  timeoutInterval: any;

  constructor(private newsSearchService: NewsSearchService){ }

  ngOnInit() {
    this.newsSearchService.isLoading.subscribe(flag => this.isLoading = flag)
  }

  onSearch(){
    this.newsSearchService.isLoading.next(true);
    this.str = this.search.nativeElement.value;
    if(this.throttleFlag){
      this.throttleFlag = false;
      this.newsSearchService.fetchNewsBySearchString(this.str);
      this.timeoutInterval = setTimeout(() => {
        this.throttleFlag = true;
      }, 2000);
    }
  }
  onReset(){
    this.search.nativeElement.value = null;
    this.newsSearchService.isLoading.next(true);
    this.newsSearchService.newsData.next(null);
  }

  ngOnDestroy(){
    if(this.timeoutInterval){
      clearTimeout(this.timeoutInterval);
      this.timeoutInterval = null;
    }
  }
}
