import { SetMetadata } from '@nestjs/common';

export const CONTENTTYPE_KEY = 'content-type';
export const ContentType = 
    (...contentTypes: string[]) => SetMetadata(CONTENTTYPE_KEY, contentTypes);