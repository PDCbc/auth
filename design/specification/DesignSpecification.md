[deployment]: 

# Authentication Component Design Specification

## Document Purpose

The purpose of this document is to specify the design for the stand-alone authentication component of Physician's Data Collaborative system. The design specified herein is intended to provide guidance for developers working on either the auth component, or a component intended to interact with the auth componet.
This design is intended to meet a subset of the system requirements for authenticating users. The requirements that will be addressed are described below. 

## Related Documents 

* This document may refer to the models and diagrams provided in the `PROJECT_ROOT/design/models/` directory of the code repository. StarUML was the modelling tool that was used to generate and maintain these documents, it can be downloaded from: [http://staruml.io/](http://staruml.io/).
 
* For convenience this document may be converted to a word document (or back to markdown) via Pandoc, a utility for converting between document types. See [http://pandoc.org/](http://pandoc.org/).

* Much of this component's design is driven by the PDC network's Security Requirements Specification, this can be found on the project Polarian instance. This requires login credentials. A brief summary of the requirements for this component are given below. 

## Summary of Requirements

These requirements are derived from general system requirements, which can be found in the PDC project Polarian instance. Specific documents of interest include the Security Requirements Specification. This section does not give a comprehensive review of requirements, other documents may need to be consulted for a more detailed explanation. 

### Auditing 

The system shall provide a means of tracking user activity (within the authentication) component. Each action a user takes shall be recorded as an event, the following information **must** be recorded:  

* date and time 
* event type or description
* user identification (when applicable), such that the true identification of the user can be determined (either via manual or automated process)
    * username
    * jurisdiction
    * role (if applicable)
    * group (if applicable)
* event outcome (when applicable/possible)
  
Specific events of interest are: 

* All authentication events, both successful and failed. 
* Verification of a previous authentication, both successful and failed. 
* All events with respect to group or role of a user
* All user management events (addition, deletion, modification)

Users of the system shall not be able to access, view, modify, or delete the audit records of the system. 

Sensitive data, such as passwords, shall hashed or encrypted (such that the original cannot be determined) prior to being recorded in audit logs.

Audit logs shall be stored in a location where they can be backed up and accessed after the fact. 
 
### Access Control

The access control policies described in the Security Requirements Specification will be *partially* met by this design. Full group based access control is beyond the current scope for this work. 

The system shall provide two roles:

* `user` which allows for basic authentication.
* `administrator` which allows one to control access for other users.

### User Management and Restrictions

* The system shall allow *only* system administrators to view, modify, delete, update, etc... the authentication information for users.
* The system shall provide a simple user interface for system administrators to manage users and their roles.   
 
### User Authentication

* The system shall provide a means of authenticating users against a list of allowed users.
* The system shall be able to verify that a previous authentication event occurred given an token.
* The system shall be able to associated roles with specific users and return the role information upon request 

## Summary of System

This authentication component (referred to as the auth component) is to be an HTTPS interface between the rest of the PDC system, and the DACS DSS user management system ([https://dacs.dss.ca/](https://dacs.dss.ca/)). The persistence and management of user information is handled by a DACS DSS programming running on the same host as this authentication component. 
  
The auth component consists of two web servers running on the same NodeJS process, but listening on different ports. One server (referred to as "control", on port 3006) provides a login and for system administrators to manage users. The other provides access to a REST API for authentication (referred to as "main" on port 3005).
 
The following diagram gives a high level view of the auth component deployment. 

![Auth Deployment](/design/models/images/current/AuthDeployment.png)


