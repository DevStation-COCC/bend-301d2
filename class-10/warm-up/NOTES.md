## Overview of today's warm-up challenge

Problems with the server:

- improper syntax for callback in app.listen
- missing backticks in console.log message
- PORT is not declared
- express is not properly instantiated as 'app'
- improper formatting in app.post callback and arrow function
- pg is not required in
- client is not instantiated and connected
- no database URL is included
- values should be an array
- values are not sent as part of the query
- values should start at $1
- id is not part of the request.body
- username and password should be properties on the request.body, not the request
- result is not a parameter of the .then
- it should be result.rowCount, not .rowsCount
- SQL query is missing semicolon (although Postgres uses ASI)

- Students may think that the SQL query is invalid, although Postgres does not care about capitalization in SQL queries

Problems with SQL:

- No primary key
- table is dropped if it doesn't exist, command is invalid and missing semicolon
- create table syntax is incorrect, should not look like a function signature
- no semis separating properties, should be commas
