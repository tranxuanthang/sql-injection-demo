# SQL Injection demo project

## Prerequisites

Docker or Node 16+

## Usage

```
git clone git@github.com:tranxuanthang/sql-injection-demo.git
cd sql-injection-demo
node index.js
```

Then visit http://localhost:3000 to start hacking.

## Usage docker

```
docker pull tranxuanthang/sql-injection-demo
docker run --rm -it --init -p 3000:3000 tranxuanthang/sql-injection-demo
```

Then visit http://localhost:3000 to start hacking.

## Database

Table `users`:

| id | username | password              |
|----|----------|-----------------------|
| 1  | admin    | ThisIsAStrongPassword |
| 2  | thang    | 111111                |

## Development

Build new Docker image:

```
docker build -t tranxuanthang/sql-injection-demo:latest .
```

Push new image to Docker Hub:

```
docker push tranxuanthang/sql-injection-demo:latest
```
