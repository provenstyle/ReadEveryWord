# Azure Table Storage 
``` mermaid

classDiagram
    class user {
        PartitionKey authId
        RowKey uuid
        Timestamp 
        email
    }

    class readingCycle {
        PartitionKey authId
        RowKey uuid
        Timestamp 
        dateStarted date
        dateCompleted date
    }

    class readingRecord {
        PartitionKey reading-cycle-row-key
        RowKey
        Timestamp 
        dateRead
        bookId
        chapterId
    }

```

# Example
``` mermaid

classDiagram
    class Foo {
        +bar
        +baz
    }

    class Issue {
        <<Abstract>>
        +int id
        +String title
        +String description
        +Status status
        +User assignedTo
        +start()
        +complete()
    }

    class Bug {
        +Severity severity
        +String report()
    }

    class Epic {
        +String featureDetails
        +requestApproval()
    }

    class Story {
        +int EpicID
    }

    class Task {
        +Date deadline
    }

    class User {
        <<Abstract>>
        +int userId
        +String username
        +String email
        +login()
        +logout()
    }
    
    class Admin {
        +manageUsers()
        +viewAllTasks()
    }

    class RegularUser {
        +viewAssignedTasks()
        +updateTaskStatus()
    }

    class TaskManager {
        <<interface>>
        +assignTask()
        +removeTask()
        +updateTask()
    }
    TaskManager <|.. TaskApp

    class TaskApp {
        +assignTask()
        +removeTask()
        +updateTask()
        +getAllTasks()
    }

    class Status {
        <<enumeration>>
        New
        Open
        In Progress
        Postponed
        Closed
    }

    class Severity {
        <<enumeration>>
        Critical
        High
        Medium
        Low
    }

    Issue "1" -->  User : assignedTo
    Issue "1" --> Status : has
    Bug "1" --> Severity : has
    Issue <|-- Bug : Inheritance
    Issue <|-- Epic : Inheritance
    Issue <|-- Task : Inheritance
    Issue <|-- Story : Inheritance
    Epic "0" --> "many" Story
    User <|-- Admin
    User <|-- RegularUser
    
```