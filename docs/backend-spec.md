# Backend Technical Specifications

>
>**Text in grey background explains the section**
> 

## Summary

>Abstract of summary. 
>
>* The Who/What/When/Where/Why

The <ins>Trello mock backend</ins> is a serverless design architecture to with support of a handful of RESTful endpoints that will handle HTTP requests from <ins>Trello mock frontend</ins> to perform the CRUD functionalities of the data stored on AWS's DynamoDB.

## Background

>Context of the project.
>* What's the motivation of this project
>* What problems are we solving here

This project is to build the API support for trello-mock-frontend.

## Goals

>Highlight the results of this project.
>* What are the outcomes of the implementation

The final product should be able:
1. Accept REST requests by providing RESTful endpoints
2. Connect to a database where data is persisted in between sessions
3. Handle requests by connecting and alternating database and send back responses
4. API endpoints should support minimum CRUD actions of appropriate data

We'd like to explore possible solutions with these technologies:
- AWS DynamoDB
- AWS Lambda Functions
- AWS API Gateway

## Non-goals

>Highlight something that we are not implementing in this project
>* Things that might be closely related and needs to be avoided
>* Reduce project scope
>* Constrain the goals

Things we will not implement: (but are commonly seen in other similar projects)
1. Authenticate and Authorization
2. Testing

## Details / Plan

>Descriptive plan and implementation details.
>* Describe in detail of the engineering approach
>* Illustrations, diagrams

### Flowchart

![Simplified Flowchart](https://guohao-public-assets.s3.ca-central-1.amazonaws.com/trello-clone-backend-flowchart.drawio.png "Flowchart")


### Data Model
### Endpoints

## Other Considerations

>Everything else to consider
>* Could be some form of a discussion
>* Questions from peer review

- Swagger or similar feature to easily display endpoints documentation

## Open Questions
>Unsolved questions
>* Most oftenly coming from peers / co-workers / stake holders