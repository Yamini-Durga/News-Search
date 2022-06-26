import { Component, Input, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { News } from './news';
import { NewsSearchService } from 'src/app/service/news-search.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NewsComponent implements OnInit {
  dataSource: News[];
  columnsToDisplay = ['Title', 'Date'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: News | null;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() searchStr: string;

  constructor(private newsSearchService: NewsSearchService) { }

  ngOnInit(): void {
    this.newsSearchService.newsData.subscribe(data => {
      this.dataSource = data;
      this.length = this.newsSearchService.totalCount;
      this.newsSearchService.isLoading.next(false);
    });
  }

  onPageSelection(event: any){
    this.newsSearchService.isLoading.next(true);
    this.newsSearchService.fetchNewsBySearchString(this.searchStr, event.pageIndex+1, event.pageSize+1);
  }

}
