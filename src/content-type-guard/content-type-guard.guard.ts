import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from "express";
import { Reflector } from '@nestjs/core';
import { CONTENTTYPE_KEY } from './content-type.decorator';


@Injectable()
export class ContentTypeGuardGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Get metadata set by ContentType decorator
    const allowedContentTypes = this.reflector.getAllAndOverride<string[]>(CONTENTTYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if no ContentType decorator was set, skip this guard
    if (!allowedContentTypes) {
      return true;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const contentType = request.headers["content-type"];
    return allowedContentTypes.includes(contentType);
  }
}
