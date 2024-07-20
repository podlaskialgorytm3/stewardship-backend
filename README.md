# Stewardship Backend

This is a web application for managing stewardship tasks. Software that helps keep track of tasks performed by group members. Helps in managing and monitoring working hours.

## Features

- User authentication and authorization
- Task creation, assignment, and tracking
- Reporting and analytics
- Notifications and reminders

## Technologies Used

- Node.js
- Express.js
- MySQL
- RESTful API

## Getting Started

To get started with the Stewardship Backend application, follow these steps:

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Configure the environment variables.
4. Start the server using `npm start`.


# API Reference

## User

#### Create User (Register)

```http
  POST /stewardship/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | `request.query` |
| `img` | `string` | `request.query` `link to your img` |
| `email` | `string` | `request.query` |
| `password` | `string` | `request.query` |

#### Get user by name

```http
  GET /stewardship/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | `request.query` |

#### Get user by id 
#### [Authorization]

```http
  GET /stewardship/user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | `request.params` |

#### Edit user
#### [Authorization]

```http
  PUT /stewardship/user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | `request.params` |
| `name` | `string` | `request.query` |
| `img` | `string` | `request.query` |

#### Login

```http
  POST /stewardship/user/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | `request.query` |
| `password` | `string` | `request.query` |

#### Delete user
#### [Authorization]

```http
  DELETE /stewardship/user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | `request.params` |

#### Change email
#### [Authorization]

```http
  PUT /stewardship/user/email/change
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | `request.query` |
| `email` | `string` | `request.query` |
| `password` | `string` | `request.query` |

#### Send link to reset password

```http
  POST /stewardship/user/password/reset
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | `request.query` |

#### Reseting password

```http
  PUT /stewardship/user/password/reset
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `newPassword` | `string` | `request.query` |
| `token` | `string` | `request.query`  `text which is sending with email account` |

#### Logout
#### [Authorization]
```http
  POST /stewardship/user/logout
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | `request.query` |

## Group

#### Create group
#### [Authorization]
```http
  POST /stewardship/group
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | `request.query` |
| `category` | `string` | `request.query` |

#### Get groups
#### [Authorization]
```http
  GET /stewardship/group
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | `request.query` |

#### Get group by id
#### [Authorization]
```http
  GET /stewardship/group/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | `request.params` |

#### Edit group
#### [Authorization]
```http
  PUT /stewardship/group/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | `request.params` |
| `name` | `string` | `request.query` |
| `category` | `string` | `request.query` |

#### Delete group
#### [Authorization]
```http
  DELETE /stewardship/group/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | `request.params` |

## Group User

#### Get users of given group
#### [Authorization]
```http
  GET /stewardship/group-user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `username` | `string` | `request.query` |

#### Get user of given group
#### [Authorization]
```http
  GET /stewardship/group-user/:userId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `userId` | `number` | `request.params` |

#### Delete user from group
#### [Authorization]
```http
  DELETE /stewardship/group-user/:userId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `userId` | `number` | `request.params` |

#### Change role
#### [Authorization]
```http
  PUT /stewardship/group-user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `userId` | `number` | `request.query` |
| `role` | `string` | `request.query` |

Role can be "member" or "admin".

#### Create groupUser
#### [Authorization]
```http
  POST /stewardship/group-user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `userId` | `number` | `request.query` |
| `role` | `string` | `request.query` |

Role can be "member" or "admin".


## Group User Request

#### Send request to join to group
#### [Authorization]
```http
  POST /stewardship/group-user-request
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |

#### Get requests
#### [Authorization]
```http
  GET /stewardship/group-user-request
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |


#### Change status of membership
#### [Authorization]
```http
  PUT /stewardship/group-user-request
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `userId` | `number` | `request.query` |
| `status` | `string` | `request.query` |

## Working Horus

#### Adding hours
#### [Authorization]
```http
  POST /stewardship/working-hours
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `start` | `Date` | `request.query` |
| `end` | `Date` | `request.query` |

#### Get hours users of given groups
#### [Authorization]
```http
  GET /stewardship/working-hours
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `name` | `string` | `request.query` |

#### Get horus of given user in particular month
#### [Authorization]
```http
  GET /stewardship/working-hours
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.params` |
| `month` | `string` | `request.query` |
| `year` | `string` | `request.query` |

#### Edit horus
#### [Authorization]
```http
  PUT /stewardship/working-hours/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `workingHourId` | `string` | `request.params` |
| `start` | `Date` | `request.query` |
| `end` | `Date` | `request.query` |

#### Delete horus
#### [Authorization]
```http
  DELETE /stewardship/working-hours/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `workingHourId` | `string` | `request.params` |

## Task

#### Create task
#### [Authorization]
```http
  POST /stewardship/task
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | `request.query` |

#### Get task
#### [Authorization]
```http
  GET /stewardship/task
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | `request.query` |

## Task Info

#### Create task info (Information about details of task)
#### [Authorization]
```http
  POST /stewardship/task-info
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `taskId` | `number` | `request.query` |
| `startDate` | `Date` | `request.query` |
| `endDate` | `Date` | `request.query` |
| `status` | `string` | `request.query` |
| `priority` | `string` | `request.query` |
| `comments` | `string` | `request.query` |
| `groupId` | `string` | `request.query` |

#### Get task info
#### [Authorization]
```http
  GET /stewardship/task-info/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `taskInfoId` | `number` | `request.params` |


#### Get all tasks info for given group user
#### [Authorization]
```http
  GET /stewardship/task-info
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupUserId` | `number` | `request.query` |

#### Edit task info
#### [Authorization]
```http
  PUT /stewardship/task-info/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `taskInfoId` | `number` | `request.params` |
| `taskId` | `number` | `request.query` |
| `startDate` | `Date` | `request.query` |
| `endDate` | `Date` | `request.query` |
| `status` | `string` | `request.query` |
| `priority` | `string` | `request.query` |
| `comments` | `string` | `request.query` |
| `groupId` | `string` | `request.query` |

#### Delete task info
#### [Authorization]
```http
  DELETE /stewardship/task-info/:id
```
(id == taskInfoId)

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `taskInfoId` | `number` | `request.params` |


## Task Affilation

#### Add user to task
#### [Authorization]
```http
  POST /stewardship/task-affilation
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `taskInfoId` | `number` | `request.query` |
| `groupUser` | `number` | `request.query` |

#### Get user who is affilationed to task
#### [Authorization]
```http
  GET /stewardship/task-affilation
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `taskInfoId` | `number` | `request.query` |

#### Delete task affilation
#### [Authorization]
```http
  DELETE /stewardship/task-affilation
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `taskInfoId` | `number` | `request.query` |
| `groupUser` | `number` | `request.query` |

## Subtask

#### Create subtask
#### [Authorization]
```http
  POST /stewardship/sub-task
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `taskInfoId` | `number` | `request.query` |
| `title` | `string` | `request.query` |
| `description` | `string` | `request.query` |
| `status` | `string` | `request.query` |

#### Get subtask
#### [Authorization]
```http
  GET /stewardship/sub-task/:id
```
(id == subTaskId)

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subTaskId` | `number` | `request.params` |

#### Delete subtask
#### [Authorization]
```http
  DELETE /stewardship/sub-task/:id
```
(id == subTaskId)

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subTaskId` | `number` | `request.params` |
| `groupId` | `string` | `request.query` |

#### Edit subtask
#### [Authorization]
```http
  PUT /stewardship/sub-task/:id
```
(id == subTaskId)


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `groupId` | `string` | `request.query` |
| `subTaskId` | `number` | `request.params` |
| `title` | `string` | `request.query` |
| `description` | `string` | `request.query` |
| `status` | `string` | `request.query` |


#### Change status of subtask
#### [Authorization]
```http
  PUT /stewardship/sub-task/change-status/:id
```
(id == subTaskId)


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subTaskId` | `number` | `request.params` |
| `status` | `string` | `request.query` |

## Contributing

Contributions are welcome! If you'd like to contribute to the Stewardship Backend application, please follow the guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).
