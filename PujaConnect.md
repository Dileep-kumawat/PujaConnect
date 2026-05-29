# PujaConnect – Online Pandit & Puja Booking Platform

## Context

A service-based digital platform that enables users to discover, compare, and book verified Pandits for religious ceremonies such as Satyanarayan Katha, Naamkaran, Griha Pravesh, Havan, Mundan, and other rituals.

Services can be booked for:

* Home-based pujas
* Temple-based ceremonies

The platform provides:

* Transparent pricing
* Availability
* Ritual details

---

## Problem Statement

Currently, booking a Pandit for religious rituals is mostly done through:

* Personal references or local contacts
* Phone calls or temple visits
* Lack of standardized pricing and availability information

This leads to:

* Difficulty in finding trusted and verified Pandits
* No clarity on puja requirements, duration, or costs
* Last-minute cancellations or scheduling issues
* Limited options for comparing services

---

## Primary Objectives

* Digitize the Pandit discovery and puja booking process
* Provide verified and trusted religious service providers
* Enable transparent pricing and ritual details
* Simplify booking and scheduling for users

---

## Secondary Objectives

* Support multiple rituals and regional traditions
* Enable Pandits to manage bookings digitally
* Provide scalability across cities and regions
* Improve accessibility to religious services

---

## Scope of the Product

### In-Scope

* Web-based platform (desktop & mobile responsive)
* Pandit profile listing and verification
* Puja and ritual catalog
* Booking and scheduling management
* Admin moderation and approvals

### Out of Scope

* Native mobile applications
* Online puja live streaming
* Advanced astrology or horoscope services
* Multi-language voice support

---

## Key Features & Functional Requirements

### User Features

* User registration & login

* Browse Pandits by:

  * Location
  * Puja type
  * Experience
  * Language

* View Pandit profiles:

  * Photo & bio
  * Supported rituals
  * Pricing
  * Availability
  * Ratings (optional phase)

* Book puja services:

  * Select ritual
  * Choose date, time, and location

* Booking history & status tracking

* Receive booking confirmation

---

### Pandit Features

* Pandit registration & profile creation
* Add supported rituals and pricing
* Set availability calendar
* Accept or reject booking requests
* Manage upcoming bookings
* Update service details

---

### Admin Features

* Verify and approve Pandit profiles
* Manage puja categories and rituals
* Monitor bookings and disputes
* Manage users and service providers
* Handle reports and feedback

---

## Non-Functional Requirements

### Performance

* Fast page load times (<3 seconds)
* Smooth booking flow

### Security

* Secure authentication
* Role-based access control

### Usability

* Simple
* Respectful
* Easy-to-navigate interface

### Scalability

* Multi-city and multi-region support

### Reliability

* Prevent double bookings and scheduling conflicts

---

## Technology Stack 

### Frontend

* HTML5
* CSS3
* JavaScript
* React.js 
* Tailwind CSS

### Backend

* Node.js with Express.js

### Database

* MongoDB 

### APIs

* REST APIs for bookings and user management

### Deployment

* Vercel 

---

## User Flow (High-Level)

1. User visits platform
2. Searches Pandit by ritual or location
3. Views Pandit profile and ritual details
4. Selects puja type, date & time
5. Sends booking request
6. Pandit accepts or rejects request
7. User receives confirmation

---

## Data Requirements

### Core Entities

* Users
* Pandits
* Rituals / Pujas
* Bookings
* Availability Schedules

---

### Sample Pandit Data

* Pandit Name
* Location
* Years of Experience
* Supported Rituals
* Languages Spoken
* Pricing (per ritual)
* Availability
* Verification Status

---

### Sample Puja Data

* Puja Name
* Description
* Duration
* Required Materials
* Price Range
* Location Type (Home / Temple)

---

## Key Performance Indicators (KPIs)

* Number of registered users
* Number of verified Pandits
* Booking completion rate
* Cancellation rate
* Average booking time

---

## Assumptions & Constraints

### Assumptions

* Pandits are willing to onboard digitally
* Basic ritual data is standardized
* Admin verification is manual initially

### Constraints

* Cultural sensitivity and accuracy required
* Limited budget for Phase 1
* Regulatory compliance for religious services

---

## Deliverables

* Functional web application
* Admin dashboard
* Pandit onboarding module
* PRD & technical documentation
* Deployment-ready build

---

## Expected Impact

* Easy access to trusted religious services
* Reduced dependency on local references
* Transparent and organized booking experience
* Digital empowerment of Pandits

---

## Future Enhancements

* Online payments & donations
* Multi-language support
* Puja reminder notifications
* Live puja streaming
* Astrology and horoscope services
* Mobile applications
