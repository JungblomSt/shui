# Shui – digital anslagstavla (REST API)

Shui är ett REST API för en digital anslagstavla där användare kan publicera, läsa, kommentera och hantera inlägg.

## Driftsatt API

Bas-URL: https://nf56z34p38.execute-api.eu-north-1.amazonaws.com

## Tekniker

- Node.js
- JavaScript
- AWS Lambda och API Gateway (HTTP API)
- DynamoDB
- Serverless Framework
- Middy
- bcrypt och JWT
- Zod
- Git
- GitHub

## Endpoints

| Metod  | Endpoint                   | Åtkomst                 |
| ------ | -------------------------- | ----------------------- |
| POST   | `/auth/register`           | Publik                  |
| POST   | `/auth/login`              | Publik                  |
| GET    | `/posts`                   | Publik                  |
| GET    | `/posts/{postId}`          | Publik                  |
| POST   | `/posts`                   | Inloggad / Gäst tillåts |
| PUT    | `/posts/{postId}`          | Inloggad ägare          |
| DELETE | `/posts/{postId}`          | Inloggad ägare          |
| GET    | `/posts/{postId}/comments` | Publik                  |
| POST   | `/posts/{postId}/comments` | Inloggad                |

## Kom igång

1. Klona repot och installera beroenden:
   ```bash
   git clone https://github.com/JungblomSt/shui.git
   cd shui
   npm install
   ```
2. Skapa `local.yml` i projektroten (filen är ignorerad av Git):
   ```yaml
   org: <ditt-serverless-org>
   role: <ARN till en IAM-roll med DynamoDB-behörighet>
   ```
3. Sätt en hemlighet för JWT:
   ```bash
   export JWT_SECRET=<lång slumpmässig sträng>
   ```
4. Driftsätt:
   ```bash
   serverless deploy
   ```
   Bas-URL:en skrivs ut under `endpoints:` när deploy är klar.

## Projektstruktur

```
src/
├── functions/ # Lambda-handlers – en mapp per endpoint
│ ├── auth/
│ │ ├── register/
│ │ └── login/
│ ├── posts/
│ │ ├── getPosts/
│ │ ├── getPost/
│ │ ├── createPost/
│ │ ├── updatePost/
│ │ └── deletePost/
│ └── comments/
│ ├── getComments/
│ └── createComment/
├── logic/ # Affärslogik
│ ├── auth.mjs
│ ├── posts.mjs
│ └── comments.mjs
├── middlewares/ # Återanvändbara Middy-middlewares
│ ├── authenticate.mjs # Verifierar JWT (krävs eller valfri för gäster)
│ ├── authorization.mjs # Kontrollerar att användaren äger inlägget
│ ├── errorHandler.mjs # Gör om alla fel till { "error": "..." }
│ ├── jsonBody.mjs # Parsar JSON-body, 400 vid ogiltig JSON
│ └── validation.mjs # Validerar body och query med Zod
├── model/ # Zod-scheman
│ ├── auth.mjs
│ ├── comments.mjs
│ └── posts.mjs
├── responses/ # sendResponse och HttpError
│ └── index.mjs
├── services/ # Databasoperationer (DynamoDB)
│ ├── comments.mjs
│ ├── db.mjs
│ ├── posts.mjs
│ └── users.mjs
└── utils/                  # Hjälpverktyg
  ├── bcrypt.mjs
  ├── guestNames.mjs
  └── jsonWebToken.mjs
```

### Ansvarsfördelning

Varje anrop passerar samma lager:

```
middlewares → handler → logic → services → DynamoDB
```

| Lager                    | Ansvar                                                      | Känner inte till |
| ------------------------ | ----------------------------------------------------------- | ---------------- |
| **middlewares**          | Autentisering, auktorisering, validering och felhantering   | Affärsregler     |
| **functions** (handlers) | Läser request, anropar logiken och returnerar svar          | DynamoDB         |
| **logic**                | Affärsregler: hashning, tokens, gästnamn, ägarskap, 404/409 | HTTP och Middy   |
| **services**             | Läser och skriver i DynamoDB, bygger nycklar                | HTTP-statuskoder |

Fel kastas som `HttpError` var som helst i kedjan och fångas av `errorHandler`. Handlers innehåller därför inga `try/catch`. Fel som inte är `HttpError` loggas och returneras som ett allmänt `500`, så att intern information inte läcker ut.

## Datamodell

API:et använder **single-table design**: användare, inlägg och kommentarer lagras i samma DynamoDB-tabell. Nycklarna har generiska namn (`PK`, `SK`, `GSI1PK` …) och värdet avgör vilken typ av post det är.

### Nycklar

| Typ       | PK                | SK                         | GSI1PK            | GSI1SK        | GSI2PK  | GSI2SK        |
| --------- | ----------------- | -------------------------- | ----------------- | ------------- | ------- | ------------- |
| Användare | `USER#<username>` | `PROFILE`                  | –                 | –             | –       | –             |
| Inlägg    | `POST#<id>`       | `POST`                     | `USER#<username>` | `<createdAt>` | `POSTS` | `<createdAt>` |
| Kommentar | `POST#<postId>`   | `COMMENT#<createdAt>#<id>` | –                 | –             | –       | –             |

### Åtkomstmönster

| Behov                         | Operation                                                        |
| ----------------------------- | ---------------------------------------------------------------- |
| Hämta användare vid login     | `Get` på `PK = USER#<username>`, `SK = PROFILE`                  |
| Hämta ett inlägg              | `Get` på `PK = POST#<id>`, `SK = POST`                           |
| Alla inlägg, senaste först    | `Query` på GSI2 där `GSI2PK = POSTS`, fallande ordning           |
| Inlägg per användarnamn       | `Query` på GSI1 där `GSI1PK = USER#<username>`, fallande ordning |
| Kommentarer, äldsta först     | `Query` på `PK = POST#<id>` och `begins_with(SK, "COMMENT#")`    |
| Radera inlägg och kommentarer | `Query` på `PK = POST#<id>`, sedan `Delete` på varje rad         |

### Exempel

| PK              | SK                                 | GSI1PK            | GSI2PK  | Övriga fält                                                        |
| --------------- | ---------------------------------- | ----------------- | ------- | ------------------------------------------------------------------ |
| `USER#jungblom` | `PROFILE`                          |                   |         | username, passwordHash, createdAt                                  |
| `POST#abc`      | `POST`                             | `USER#jungblom`   | `POSTS` | id, username, isGuest: false, title, content, createdAt, updatedAt |
| `POST#abc`      | `COMMENT#2026-11-20T13:00:00Z#xyz` |                   |         | id, postId, username, content, createdAt                           |
| `POST#def`      | `POST`                             | `USER#unicorn123` | `POSTS` | id, username, isGuest: true, title, content, createdAt, updatedAt  |

### Designval

- **Bara inlägg finns i indexen.** Användare och kommentarer saknar GSI-fält och hamnar därför inte i GSI1 eller GSI2. Det gör att `GET /posts` bara får inlägg.
- **Index i stället för `Scan`.** GSI2 har samma partitionsnyckel (`POSTS`) för alla inlägg, så alla inlägg kan hämtas sorterade med en enda `Query`. Det är en medveten avvägning för ett projekt i den här storleken: vid väldigt många inlägg skulle partitionen bli en flaskhals.
- **Datum som sorteringsnyckel.** ISO 8601-datum sorteras korrekt som text, så DynamoDB sköter sorteringen.
- **Kommentarer i samma partition som inlägget.** De hämtas äldsta först direkt, och när ett inlägg raderas hittas dess kommentarer med samma `Query`.
- **Gästinlägg** följer samma mönster som andra inlägg. Därför fungerar filtreringen `?username=` även för automatiskt genererade gästnamn.
- **Unika användarnamn** garanteras av `ConditionExpression: attribute_not_exists(PK)`, även vid samtidiga registreringar.
- **Nyckelfälten visas aldrig i API-svaren.** `services/` tar bort `PK`, `SK` och GSI-fälten innan datan lämnas vidare.

## Validering

- Användarnamn: 3-20 tecken
- Lösenord: 8-20 tecken, min. 1 gemen, min. 1 versal, min. 1 siffra och min. 1 specialtecken
- Post: Titel: 1–50 tecken, Innehåll: 1–1000 tecken
- Kommentar: 1-750 tecken

- Mellanslag i början och slutet tas bort
- Ogiltiga värden ger 400, fältnamn och felmeddelande

## Designbeslut

- **Lagerindelning** Handlers gör bara HTTP, `logic/` innehåller affärsreglerna och `services/` kommunicerar med databasen, Fel kastas som `HttpError` och fångas av `errorHandler`.
- **Säkra felmeddelanden** Endast fel jag kastat ger felmeddelanden till användaren, övriga loggas och ger ett allmänt `500`.
- **Inloggning** Samma meddelande vid inloggning, oavsett om det är användarnamn eller lösenord som är fel.
- **Identiteten kommer från JWT.** Zod tar bort fält som inte finns i schemat, så ett `username` i request body ignoreras.
- **En konfigurerbar `authenticate`.** `authenticate({ optional: true })` släpper igenom gäster på `POST /posts`, men en ogiltig token ger fortfarande `401`.
- **Användarnamn** är `caseSensetive` dvs. `jungblom` och `Jungblom` är olika användare
- **Ägarskap** `isGuest` kontrolleras innan användarnamn för att en registrerad användare inte ska kunna ändra/radera ett gästinlägg.
