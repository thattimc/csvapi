# CsvApi
## Feature Implemented

- [x] `/sales/record` To receive the data in CSV format.
- [x] `/sales/report` To query data with JSON format response.
- [x] `/sales/report` User should be able to query with date inputs (single date or date range).
- [x] Use of any popular server framework
- [x] You can assume the CSV data file is a very big file. e.g. 1GB or bigger
- [x] Implement data storage with in-memory or actual database
## For setup local development

Install all packages

```
yarn
```

Generate CSV file for testing csv upload

```
yarn seed
```

Setup local postgresql with `mydb` as db name, then rename `.env.exmaple` to `.env`

Update db access login from DATABASE_URL

```
PORT=8081
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Create tables in your database
```
npx prisma db push --preview-feature
```

Access DB GUI with prisma studio
```
npx prisma studio
```

Start the api server
```
yarn start
```

## For test the api

Use postman or Insomnia
### Upload Sales Record

- Create request named with `Upload Sales Record`
- Method - POST
- Endpoint - http://localhost:8081/sales/record
- Multipart - Choose `sales.csv`

### View Sales Record with Single Date

- Create request named with `View Sales Record with Single Date`
- Method - POST
- Endpoint - http://localhost:8081/sales/report
- Form
  - Name: date
  - Value: 2012/10/29

### View Sales Record with Date Range

- Create request named with `View Sales Record with Date Range`
- Method - POST
- Endpoint - http://localhost:8081/sales/report
- Form
  - Name: startDate
  - Value: 2019/02/01
  - Name: endDate
  - Value: 2019/03/01
  
