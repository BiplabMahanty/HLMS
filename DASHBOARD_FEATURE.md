# Dashboard Feature

## Overview
A comprehensive dashboard page that displays all system statistics and metrics.

## Features

### Statistics Cards
- **Total Admins**: Shows total and active admin count
- **Total Sellers**: Shows total and active seller count
- **Total Tickets**: Shows total tickets and deleted tickets count
- **Total Revenue**: Shows total revenue collected and pending dues

### Today's Summary
- Today's Revenue
- Today's Bill Amount
- Total Bill Amount

### Recent Payments
- Last 5 payment transactions
- Seller name and phone
- Payment amount and date

### System Overview
- Collection Rate (percentage)
- Pending Amount
- Active Users count

## Backend Endpoint
**GET** `/api/seller/dashboard-stats`
- Requires authentication token
- Returns comprehensive statistics

## Frontend Routes
- Admin: `/dashboard`
- SuperAdmin: `/superadmin/dashboard`

## Access
Both admin and superadmin roles can access the dashboard.
