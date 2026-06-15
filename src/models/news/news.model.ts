import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';
import dayjs from 'dayjs';

export default interface News {
    id: number;
    title: string;
    text: string;
    url: Url;
    imageId?: number;
    image?: Image;
    creationDate: dayjs.Dayjs;
}

export interface RandomNews {
    title: string;
    randomNewsUrl: string;
}

export interface NewsWithUrl {
    news: News;
    prevNewsUrl: string;
    nextNewsUrl: string;
    randomNews: RandomNews;

}

export interface NewsCreateUpdate {
    id: number;
    title: string;
    text: string;
    imageId: number;
    url: string;
    creationDate: string;
}