# Database ERD Diagram

## Mermaid ERD Diagram

```mermaid
erDiagram
    users ||--o| jamaahs : "has one"
    users ||--o{ payments : "verifies many"
    users ||--o{ documents : "verifies many"
    users ||--o{ consultations : "handles many"
    
    travel_packages ||--o{ jamaahs : "has many"
    travel_packages ||--o{ tabungans : "has many"
    travel_packages ||--o{ consultations : "has many"
    
    jamaahs ||--|| tabungans : "has one"
    jamaahs ||--o{ payments : "makes many"
    jamaahs ||--o{ documents : "has many"
    jamaahs ||--o{ consultations : "makes many"
    jamaahs }o--|| users : "belongs to"
    jamaahs }o--o| travel_packages : "belongs to"
    
    tabungans ||--o{ payments : "has many"
    tabungans }o--|| jamaahs : "belongs to"
    tabungans }o--|| travel_packages : "belongs to"
    
    payments }o--|| tabungans : "belongs to"
    payments }o--|| jamaahs : "belongs to"
    payments }o--o| users : "verified by"
    
    documents }o--|| jamaahs : "belongs to"
    documents }o--o| users : "verified by"
    
    consultations }o--o| jamaahs : "belongs to"
    consultations }o--o| travel_packages : "belongs to"
    consultations }o--o| users : "handled by"

    users {
        bigint id PK
        string name
        string email UK
        string password
        timestamp email_verified_at
        string remember_token
        timestamp two_factor_confirmed_at
        timestamps created_at_updated_at
    }

    jamaahs {
        bigint id PK
        bigint user_id FK
        string name
        string nik UK
        string email UK
        string phone
        text address
        date registration_date
        bigint travel_package_id FK
        enum status
        string profile_image
        timestamps created_at_updated_at
    }

    travel_packages {
        bigint id PK
        string name
        string duration
        decimal price
        int quota
        int booked
        int available
        date departure_date
        enum status
        decimal rating
        string hotel_makkah
        string hotel_madinah
        string airline
        json features
        json highlights
        string best_for
        text description
        timestamps created_at_updated_at
    }

    tabungans {
        bigint id PK
        bigint jamaah_id FK
        bigint travel_package_id FK
        decimal target_amount
        decimal current_amount
        int progress
        enum status
        date last_payment_date
        date next_payment_date
        decimal monthly_payment
        timestamps created_at_updated_at
    }

    payments {
        bigint id PK
        bigint tabungan_id FK
        bigint jamaah_id FK
        decimal amount
        date payment_date
        enum payment_method
        enum status
        string receipt_path
        text notes
        bigint verified_by FK
        timestamp verified_at
        timestamps created_at_updated_at
    }

    documents {
        bigint id PK
        bigint jamaah_id FK
        string document_type
        enum status
        string file_path
        date expiry_date
        text notes
        bigint verified_by FK
        timestamp verified_at
        timestamps created_at_updated_at
    }

    accommodations {
        bigint id PK
        string name
        enum type
        string location
        decimal rating
        string capacity
        string price
        enum status
        json facilities
        text description
        string image
        timestamps created_at_updated_at
    }

    consultations {
        bigint id PK
        bigint jamaah_id FK
        string name
        string phone
        string email
        string subject
        text message
        string category
        bigint travel_package_id FK
        date preferred_date
        enum status
        bigint handled_by FK
        text response
        timestamp responded_at
        timestamps created_at_updated_at
    }
```

## Database Flow Diagram

```mermaid
flowchart TB
    A[User Register] --> B[Create User Account]
    B --> C[Create Jamaah Profile]
    C --> D[Select Travel Package]
    D --> E[Create Tabungan]
    E --> F[Make Payment]
    F --> G{Payment Status}
    G -->|Pending| H[Admin Review]
    H --> I{Approved?}
    I -->|Yes| J[Update Tabungan]
    I -->|No| K[Reject Payment]
    J --> L{Check Progress}
    L -->|< 100%| F
    L -->|= 100%| M[Status: Lunas]
    M --> N[Upload Documents]
    N --> O[Admin Verify Documents]
    O --> P[Ready for Departure]
```

## Payment Verification Flow

```mermaid
sequenceDiagram
    participant J as Jamaah
    participant S as System
    participant A as Admin
    participant T as Tabungan

    J->>S: Upload Payment Receipt
    S->>S: Create Payment (Status: Pending)
    S->>A: Notify Admin
    A->>S: Review Payment
    alt Payment Valid
        A->>S: Approve Payment
        S->>T: Update Current Amount
        S->>T: Calculate Progress
        T->>S: Check if Progress = 100%
        alt Lunas
            S->>J: Update Status to Lunas
            S->>J: Notify: Ready for Departure
        else Belum Lunas
            S->>J: Notify: Payment Approved
        end
    else Payment Invalid
        A->>S: Reject Payment
        S->>J: Notify: Payment Rejected
    end
```

## Document Upload Flow

```mermaid
stateDiagram-v2
    [*] --> PerluUpload: Jamaah Created
    PerluUpload --> DalamReview: Upload Document
    DalamReview --> Lengkap: Admin Approve
    DalamReview --> Ditolak: Admin Reject
    Ditolak --> PerluUpload: Re-upload
    Lengkap --> [*]
```

## Consultation Flow

```mermaid
stateDiagram-v2
    [*] --> Pending: Submit Consultation
    Pending --> InProgress: Admin Assign
    InProgress --> Resolved: Admin Respond
    Resolved --> Closed: Issue Resolved
    Closed --> [*]
```

## Tabungan Progress Flow

```mermaid
graph LR
    A[New Tabungan<br/>Progress: 0%] --> B[First Payment<br/>Progress: 2.86%]
    B --> C[Monthly Payment<br/>Progress: +2.86%]
    C --> D[Continue Paying<br/>Progress: 50%]
    D --> E[Almost Done<br/>Progress: 97%]
    E --> F[Final Payment<br/>Progress: 100%]
    F --> G[Status: Lunas]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style F fill:#9f9,stroke:#333,stroke-width:2px
    style G fill:#6f6,stroke:#333,stroke-width:4px
```

## System Architecture

```mermaid
graph TB
    subgraph Frontend
        FE[React App<br/>Port 5173]
    end
    
    subgraph Backend
        API[Laravel API<br/>Port 8000]
        AUTH[Fortify Auth]
        SANC[Sanctum Tokens]
    end
    
    subgraph Database
        DB[(MySQL<br/>Taburoh)]
    end
    
    subgraph Storage
        FILES[File Storage<br/>Documents & Receipts]
    end
    
    FE -->|HTTP Requests| API
    API --> AUTH
    API --> SANC
    API --> DB
    API --> FILES
    
    style FE fill:#61dafb,stroke:#333,stroke-width:2px
    style API fill:#ff2d20,stroke:#333,stroke-width:2px
    style DB fill:#4479a1,stroke:#333,stroke-width:2px
```

## Data Flow: Complete Journey

```mermaid
journey
    title Jamaah Journey - From Registration to Departure
    section Registration
      Register Account: 5: Jamaah
      Create Profile: 5: Jamaah
      Select Package: 5: Jamaah
    section Payment
      Create Tabungan: 5: System
      Make Payment: 3: Jamaah
      Wait Verification: 2: Jamaah
      Approved: 5: Admin
    section Documents
      Upload Documents: 3: Jamaah
      Wait Verification: 2: Jamaah
      Approved: 5: Admin
    section Consultation
      Ask Questions: 4: Jamaah
      Get Response: 5: Admin
    section Departure
      Manasik Training: 5: Jamaah
      Ready to Go: 5: Jamaah
```

## Package Booking Timeline

```mermaid
gantt
    title Umroh Package Timeline
    dateFormat YYYY-MM-DD
    section Registration
    Open Registration           :2026-01-01, 30d
    Early Bird Discount        :2026-01-01, 15d
    section Payment
    First Payment Period       :2026-01-15, 45d
    Monthly Payment Period     :2026-03-01, 60d
    Final Payment Deadline     :2026-04-30, 1d
    section Preparation
    Document Collection        :2026-03-15, 30d
    Manasik Training          :2026-04-15, 10d
    section Departure
    Flight Booking            :2026-05-01, 5d
    Departure Date            :milestone, 2026-05-15, 0d
```

## Entity Counts (Visual)

```mermaid
pie title Database Entities
    "Users" : 1
    "Jamaahs" : 150
    "Travel Packages" : 4
    "Tabungans" : 150
    "Payments" : 800
    "Documents" : 750
    "Accommodations" : 5
    "Consultations" : 200
```

## Status Distribution

```mermaid
pie title Jamaah Status Distribution
    "Aktif" : 100
    "Menunggu" : 25
    "Lunas" : 15
    "Tertunggak" : 8
    "Non-Aktif" : 2
```

## Payment Methods Distribution

```mermaid
pie title Payment Methods
    "Transfer BCA" : 40
    "Transfer BRI" : 30
    "Transfer Mandiri" : 20
    "Transfer BNI" : 5
    "E-Wallet" : 4
    "Cash" : 1
```
