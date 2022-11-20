# nest.js

<img width="300px" src="./nestjs.png" />

> Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications

nest.js ist ein HTTP-Server Framework, geschrieben in TypeScript.
Als higher-level framework baut es entweder auf express (default) oder auf fastify auf.

nest.js bietet eine Architektur, welche es erlaubt, einfach eine strukturierte und testbare Anwendung zu erstellen.

Die verwendeten Konzepte / Architektur ist an _Angular_ angelehnt. Da hier auch JavaScript / TypeScript genutzt wird, können sehr leicht Klassen oder Interfaces zwischen Client- und Servercode geteilt werden.

<div style="page-break-after: always;"></div>

## Quick Start

### Eine neue Anwendung erstellen:

```Bash
$ npm i -g @nestjs/cli
$ nest new project-name
$ cd project-name
```

### Anwendung starten:

```Bash
$ nest start
ODER:
$ npm run start
```

### Übersicht:

```
.
├── README.md
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts       --> A basic controller
│   ├── app.module.ts           --> Root Module
│   ├── app.service.ts          --> A basic service
│   └── main.ts                 --> Entry file
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

### Testen:

```Bash
$ jest
ODER:
$ npm run test
```

<div style="page-break-after: always;"></div>

## Komponenten

### Controller

Controller behandeln eingehende Requests und senden Antworten zum Client.

nest.js teilt eine eingehende Anfrage automatisch dem richtigen Controller zu.

#### Routing

Ein einfacher Controller:

```TypeScript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
  @Get('/:id')
  findById(@Param() id: string): string {
    return 'This action one cat by id';
  }
}
```

Anfragen auf `<root>/cats` werden an diesen Controller, an die Methode `findAll` geleitet.
Anfragen auf `<root>/cats/mauzi` werden an diesen Controller, an die Methode `findById` geleitet.

Mehr zu Controllern: unter https://docs.nestjs.com/controllers

> Um einfache CRUD Controller lassen sich mit `nest g resource [name]` generieren.

> Controller werden in der _controller_ Liste eines Moduls eingetragen.

<div style="page-break-after: always;"></div>

### Providers

Alle '_injectable_' Classen sind so genannte Provider. Provider können Komponentenübergreifend genutzt werden und stellen somit die Verbindung zwischen diesen dar.

Ein Service kann wie folgt angelegt werden:

```Bash
$ nest g service cats
```

```TypeScript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

#### Dependency Injection

nest.js nutzt das Design Pattern _Dependency Injection_. Dadurch wird dem Entwickler die Aufgabe abgenommen, sich um die Verteilung von Services, etc. zu kümmern.

#### Scopes

Mittels scopes kann konfiguriert werden, wie nest.js neue Instanzen eines Providers anlegt. Hierfür sind die folgenden drei Scopes vorgesehen:

- `DEFAULT`: Per default werden Instanzen als Singleton angelegt. Diese leben über den gesamten Lebenszyklus der Anwendung.
- `REQUEST`: Für jeden neuen HTTP-Request wird eine neue Instanz des Providers angelegt. Wird der Request beendet, so wird auch die Instanz des Providers zerstört / garbage collected.
- `TRANSIENT`: Transient Providers werden nicht geteilt. Jeder Konsument bekommt eine eigene Instanz.

```TypeScript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

> Privder werden in der _providers_ Liste eines Moduls eingetragen.

### Modules

Module kapseln Providers und Controller, importieren andere Module und exportieren Provider oder Module.

Das Root Module wird genutzt, um die Anwendung hochzuziehen. Andere Module müssen unterhalb diesem Moduls eingehängt werden.

```TypeScript
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### Middlewares

Middlewares sind Funktionen, welche ausgeführt werden, bevor der Controller-Handler mit dem Request aufgerufen wird.
Middleware Funktionen haben Zugriff auf den Request, sowie auch auf die Response.

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
```

### Exception Filters

nest.js beitet eine Logikschicht an, um Exceptions zu fangen und zu behandeln.
Alle "unhandled exceptions" werden hier gefangen und zu einer benutzerfreundlichen Nachricht transformiert. Unbekannte Fehler werden dabei als HTTP Status 500 behandelt. Bekannte, von der Klasse `HttpException` abgeleitete Klassen werden der Klassenkonfiguration entsprechend behandelt.

Beispiel:

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### Pipes

Pipes validieren oder transformieren Eingangsdaten wie z.B. Query Parameter.
Es gibt einige eingebaute Pipes:

- `ValidationPipe`
- `Parse*Pipe`
- `DefaultValuePipe`

#### ValidationPipe

Diese Pipe validiert die Eingangsdaten anhand von `class-validator` Konfigurationen eines Dto Objekts:

```typescript
import { IsString, IsInt } from "class-validator";

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

Beispielhafte Verwendung als GlobalPipe:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

Beispielhafte Verwendung:

```typescript
@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

<div style="page-break-after: always;"></div>

### Guards

Guards sind _injectable_ Klassen, welche das `CanActivate` Interface implementieren.
Guards werden dafür genutzt, bestimmte Routen nur authentifizieren oder authorisierten Benutzern zur Verfügung zu stellen.

Beispiel:

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

### Interceptors

Interceptors sind Methoden, welche Aktivitäten vor, während und nach einem Request einhängen können.

<div style="page-break-after: always;"></div>

Beispiel:

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

Interceptors können wie folgt eingehängt werden:

```typescript
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```
