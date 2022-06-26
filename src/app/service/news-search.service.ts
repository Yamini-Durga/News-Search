import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { News } from '../components/news/news';

@Injectable({
  providedIn: 'root'
})
export class NewsSearchService {
  newsData = new Subject<News[]>();
  totalCount: number;
  isLoading = new BehaviorSubject<boolean>(false);
  constructor() { }

  fetchNewsBySearchString(searchStr: string, pageNumber: number = 1, pageSize: number = 10){
    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '39a8186ddfmsh037756d8aba7915p1af440jsn9f50e52742ad',
        'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
      }
    };
  
    const url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=${searchStr}&pageNumber=${pageNumber}&pageSize=${pageSize}&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null`;
    fetch(url, options)
      .then(response => response.json())
      .then(response => {
          this.totalCount = response.totalCount;
          var newsList = [];
          response.value.map(news => {
              let newsObj = {
                Title: news.title,
                Description: news.description,
                Date: news.datePublished,
                body: news.body,
                imageurl: news.image.url,
                newsUrl: news.url
              }
              newsList.push(newsObj);
          });
          this.newsData.next(newsList);
       })
      .catch(err => console.error(err));
  }
}
